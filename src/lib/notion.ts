import { NotionAPI } from 'notion-client'
import { ExtendedRecordMap } from 'notion-types'
import { getDateValue, getTextContent } from 'notion-utils'

const notion = new NotionAPI()

function unwrapNotionRecord<T extends { value?: any }>(record: T): T {
    if (record?.value?.value) {
        return {
            ...record.value,
            spaceId: (record as any).spaceId ?? record.value.spaceId,
        }
    }

    return record
}

function normalizeRecordMap(recordMap: ExtendedRecordMap): ExtendedRecordMap {
    const mapKeys = ['block', 'collection', 'collection_view', 'notion_user'] as const

    mapKeys.forEach((mapKey) => {
        const map = (recordMap as any)[mapKey]
        if (!map) return

        Object.keys(map).forEach((key) => {
            map[key] = unwrapNotionRecord(map[key])
        })
    })

    return recordMap
}

function fixRecordMap(recordMap: ExtendedRecordMap): ExtendedRecordMap {
    const domain = 'https://ryonicho.github.io'

    if (recordMap.block) {
        Object.values(recordMap.block).forEach((blockItem) => {
            if (!blockItem?.value) return
            const val = blockItem.value

            // Fix Image source
            if (val.properties?.source) {
                const src = val.properties.source?.[0]?.[0]
                if (typeof src === 'string' && src.startsWith('/')) {
                    val.properties.source[0][0] = `${domain}${src}`
                }
            }

            // Fix Page Cover
            if (val.format?.page_cover) {
                const cover = val.format.page_cover
                if (cover.startsWith('/')) {
                    if (cover.startsWith('/image')) {
                        val.format.page_cover = `https://www.notion.so${cover}`
                    } else {
                        val.format.page_cover = `${domain}${cover}`
                    }
                }
            }
        })
    }
    return recordMap
}

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
    const recordMap = await notion.getPage(pageId)
    return fixRecordMap(normalizeRecordMap(recordMap))
}

export interface Post {
    id: string
    title: string
    date: string
    category?: string
    tags?: string[]
    slug?: string
    cover?: string
    summary?: string
}

export async function getPosts(rootPageId: string): Promise<Post[]> {
    const recordMap = await getPage(rootPageId) // Helper already normalizes and fixes recordMap
    let block = recordMap.block

    console.log(`Debug: recordMap for ${rootPageId}`)
    console.log(`Debug: Block keys: ${Object.keys(block).length}`)

    // Robust unwrapping: Drill down into collection.value until we find the actual data
    let collection = Object.values(recordMap.collection || {})[0]?.value as any

    let depth = 0
    while (collection?.value && depth < 3) {
        if (collection.schema) break;
        console.log(`Debug: Unwrapping collection at depth ${depth}`)
        collection = collection.value
        depth++
    }

    if (collection) {
        console.log(`Debug: Collection found. ID: ${collection.id}`)
        console.log(`Debug: Collection keys: ${Object.keys(collection).join(', ')}`)
    } else {
        console.log("Debug: Collection value is undefined")
    }

    const schema = collection?.schema

    if (!collection) {
        console.log("Debug: No collection found in recordMap")
        return []
    }
    if (!schema) {
        console.log("Debug: No schema found in collection")
        return []
    }

    const posts: Post[] = []

    const rootCollectionBlock = Object.values(block)
        .map((blockItem) => blockItem?.value as any)
        .find((val) => val?.type === 'collection_view' && val.collection_id)

    const collectionId = collection.id || rootCollectionBlock?.collection_id
    const collectionViewId = rootCollectionBlock?.view_ids?.[0]
    const collectionView = collectionViewId ? recordMap.collection_view?.[collectionViewId]?.value : undefined

    if (collectionId && collectionViewId) {
        try {
            const collectionData = await notion.getCollectionData(
                collectionId,
                collectionViewId,
                collectionView,
                {
                    limit: 999,
                    spaceId: rootCollectionBlock?.space_id,
                }
            )

            const collectionBlockIds = Array.from(
                new Set<string>(((collectionData as any).allBlockIds || []).filter(Boolean))
            )
            const hydratedBlocks = collectionBlockIds.length
                ? await notion.getBlocks(collectionBlockIds)
                : undefined

            const collectionRecordMap = normalizeRecordMap(collectionData.recordMap as ExtendedRecordMap)
            const hydratedRecordMap = hydratedBlocks
                ? normalizeRecordMap(hydratedBlocks.recordMap as ExtendedRecordMap)
                : undefined

            recordMap.block = {
                ...recordMap.block,
                ...collectionRecordMap.block,
                ...hydratedRecordMap?.block,
            }
            recordMap.collection = {
                ...recordMap.collection,
                ...collectionRecordMap.collection,
                ...hydratedRecordMap?.collection,
            }
            recordMap.collection_view = {
                ...recordMap.collection_view,
                ...collectionRecordMap.collection_view,
                ...hydratedRecordMap?.collection_view,
            }
            recordMap.notion_user = {
                ...recordMap.notion_user,
                ...collectionRecordMap.notion_user,
                ...hydratedRecordMap?.notion_user,
            }
            recordMap.collection_query = {
                ...recordMap.collection_query,
                [collectionId]: {
                    ...recordMap.collection_query?.[collectionId],
                    [collectionViewId]: collectionData.result?.reducerResults,
                },
            }

            fixRecordMap(recordMap)
            block = recordMap.block
        } catch (error) {
            console.error("Debug: Failed to query Notion collection", error)
        }
    }

    // Map schema keys to readable names
    let categoryKey = ''
    let tagsKey = ''
    let dateKey = ''
    let originalDateKey = ''
    let summaryKey = ''
    let slugKey = ''

    Object.keys(schema).forEach(key => {
        const name = schema[key].name.toLowerCase()
        if (name === '카테고리' || name === 'category') categoryKey = key
        if (name === '태그' || name === 'tags') tagsKey = key
        if (name === '생성일' || name === 'date' || name === 'created') dateKey = key
        if (name === 'original creation date' || name === '최초생성일') originalDateKey = key
        if (name === '요약' || name === 'summary' || name === 'description') summaryKey = key
        if (name === 'slug' || name === 'url') slugKey = key
    })

    console.log(`Debug: Checking ${Object.values(block).length} blocks against collectionId ${collectionId}`)

    Object.values(block).forEach((blockItem) => {
        if (!blockItem?.value) return
        let val = blockItem.value as any

        // Check for double-wrapping (common in some Notion API responses)
        if (val.value) {
            val = val.value
        }

        if (val.parent_id === collectionId) {
            // console.log(`Debug: Found matching parent for block ${val.id}`)
        }

        if (
            val.type === 'page' &&
            val.parent_id === collectionId
        ) {
            const props: any = val.properties || {}

            // Extract Data
            const title = props.title ? getTextContent(props.title) : 'Untitled'

            // Date handling
            let date = new Date(val.created_time).toISOString()

            // 1. Try Original Creation Date first
            if (originalDateKey && props[originalDateKey]) {
                const dateVal = getDateValue(props[originalDateKey])
                if (dateVal) date = new Date(dateVal.start_date).toISOString()
            }
            // 2. Fallback to standard Date property
            else if (dateKey && props[dateKey]) {
                const dateVal = getDateValue(props[dateKey])
                if (dateVal) date = new Date(dateVal.start_date).toISOString()
            }

            // Category (Select)
            const category = props[categoryKey]?.[0]?.[0] || 'Uncategorized'

            // Tags (Multi-select)
            const rawTags = props[tagsKey] || []
            const tags = rawTags.map((t: any) => t[0]) // Simplistic extraction

            // Summary
            const summary = summaryKey && props[summaryKey] ? getTextContent(props[summaryKey]) : ''

            // Slug
            const slug = slugKey && props[slugKey] ? getTextContent(props[slugKey]) : ''

            // Cover
            let cover = ''
            if (val.format?.page_cover) {
                const coverUrl = val.format.page_cover

                if (coverUrl.startsWith('/')) {
                    const fullUrl = `https://www.notion.so${coverUrl}`
                    cover = `https://www.notion.so/image/${encodeURIComponent(fullUrl)}?table=block&id=${val.id}&cache=v2`
                } else if (coverUrl.startsWith('http')) {
                    cover = `https://www.notion.so/image/${encodeURIComponent(coverUrl)}?table=block&id=${val.id}&cache=v2`
                } else {
                    cover = coverUrl
                }
            }

            posts.push({
                id: val.id,
                title,
                date,
                category,
                tags,
                cover,
                summary,
                slug
            })
        }
    })

    // Sort by date desc
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return posts
}
