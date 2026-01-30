import { NotionAPI } from 'notion-client'
import { getTextContent } from 'notion-utils'

const notion = new NotionAPI()
const rootPageId = '2f873e521efd80f89135c15c198b3bf2' // From config.ts or user knowledge

async function debug() {
    console.log('Fetching page...')
    const recordMap = await notion.getPage(rootPageId)
    const block = recordMap.block
    const collection = Object.values(recordMap.collection)[0]?.value

    if (!collection) {
        console.log('No collection found!')
        return
    }

    const collectionId = collection.id
    console.log('Collection ID:', collectionId)

    // Inspect the first few posts
    let count = 0
    Object.values(block).forEach((blockItem) => {
        if (!blockItem?.value) return
        const val = blockItem.value

        if (val.type === 'page' && val.parent_id === collectionId) {
            if (count < 3) {
                console.log('\n--- Post ---')
                console.log('ID:', val.id)
                console.log('Title:', val.properties?.title ? getTextContent(val.properties.title) : 'No Title')
                console.log('Format:', JSON.stringify(val.format || {}, null, 2))
                console.log('Page Cover Raw:', val.format?.page_cover)

                // Test URL Generation Logic
                if (val.format?.page_cover) {
                    const coverUrl = val.format.page_cover
                    let generated = ''
                    if (coverUrl.startsWith('/')) {
                        const fullUrl = `https://www.notion.so${coverUrl}`
                        generated = `https://www.notion.so/image/${encodeURIComponent(fullUrl)}?table=block&id=${val.id}&cache=v2`
                    } else {
                        generated = `https://www.notion.so/image/${encodeURIComponent(coverUrl)}?table=block&id=${val.id}&cache=v2`
                    }
                    console.log('Generated URL:', generated)
                }
                count++
            }
        }
    })
}

debug()
