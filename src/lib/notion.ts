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
                    // Check if it is a notion relative path or our assets
                    // Notion relative paths usually don't look like /assets/... but usually /image/...
                    // But to be safe, if it contains 'assets', we assume it's ours.
                    // Or simply prefix everything that starts with / and is NOT notion.so
                    // Just prefixing works for now as long as NotionRenderer handles it.
                    val.format.page_cover = `${domain}${cover}`
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

    Object.keys(schema).forEach(key => {
        const name = schema[key].name
        if (name === '카테고리' || name === 'Category') categoryKey = key
        if (name === '태그' || name === 'Tags') tagsKey = key
        if (name === '생성일' || name === 'Date' || name === 'Created') dateKey = key
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
            if (dateKey && props[dateKey]) {
                const dateVal = getDateValue(props[dateKey])
                if (dateVal) date = new Date(dateVal.start_date).toISOString()
            }

            // Category (Select)
            const category = props[categoryKey]?.[0]?.[0] || 'Uncategorized'

            // Tags (Multi-select)
            const rawTags = props[tagsKey] || []
            const tags = rawTags.map((t: any) => t[0]) // Simplistic extraction

            // Cover
            let cover = ''
            if (val.format?.page_cover) {
                const coverUrl = val.format.page_cover
                // fixRecordMap already prefixed absolute URLs for local assets
                // If it's a Notion hosted image, it might start with /image/...
                if (coverUrl.startsWith('http')) {
                    cover = coverUrl
                } else if (coverUrl.startsWith('/')) {
                    // If fixRecordMap didn't catch it for some reason or logic overlap
                    cover = 'https://www.notion.so' + coverUrl
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
                cover
            })
        }
    })

    // Sort by date desc
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return posts
}
