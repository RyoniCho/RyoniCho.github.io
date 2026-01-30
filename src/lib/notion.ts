import { NotionAPI } from 'notion-client'
import { ExtendedRecordMap } from 'notion-types'
import { getDateValue, getTextContent } from 'notion-utils'

const notion = new NotionAPI()

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
    return fixRecordMap(recordMap)
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
    const recordMap = await getPage(rootPageId) // Helper already calls fixRecordMap
    const block = recordMap.block
    const collection = Object.values(recordMap.collection)[0]?.value
    const schema = collection?.schema

    if (!collection || !schema) return []

    const posts: Post[] = []

    const collectionId = collection.id

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

    Object.values(block).forEach((blockItem) => {
        if (!blockItem?.value) return
        const val = blockItem.value

        if (
            val.type === 'page' &&
            val.parent_id === collectionId &&
            val.content
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
                    // It's a Notion relative URL, needs to be proxied
                    // Format: https://www.notion.so/image/{encoded_url}?table=block&id={block_id}
                    const fullUrl = `https://www.notion.so${coverUrl}`
                    cover = `https://www.notion.so/image/${encodeURIComponent(fullUrl)}?table=block&id=${val.id}&cache=v2`
                } else if (coverUrl.startsWith('http')) {
                    // External URL or already absolute
                    // Even external images often need proxying if they are S3 signed urls that expire,
                    // but static external images (unsure) might work. 
                    // Safest for Notion user content is to proxy if it looks like an S3 url, 
                    // but for user provided links let's keep as is unless broken.
                    // Actually, standard Notion practice is to proxy everything to handle resizing/caching.
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
