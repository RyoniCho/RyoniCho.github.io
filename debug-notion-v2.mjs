import { NotionAPI } from 'notion-client'
import { getTextContent } from 'notion-utils'

const notion = new NotionAPI()
const rootPageId = '2f873e521efd80f89135c15c198b3bf2'

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

    // Log Schema to find Property IDs
    console.log('\n--- Schema (Column Definitions) ---')
    const schema = collection.schema
    let summaryKey = ''
    Object.keys(schema).forEach(key => {
        const name = schema[key].name;
        const type = schema[key].type;
        console.log(`ID: ${key} | Name: "${name}" | Type: ${type}`)
        if (name.toLowerCase() === 'summary' || name === '요약') {
            summaryKey = key
        }
    })
    console.log(`\nFound Summary Key: "${summaryKey}"`)

    // Inspect the first few posts
    let count = 0
    Object.values(block).forEach((blockItem) => {
        if (!blockItem?.value) return
        const val = blockItem.value

        if (val.type === 'page' && val.parent_id === collectionId) {
            if (count < 5) {
                console.log('\n--- Post ---')
                console.log('ID:', val.id)
                const title = val.properties?.title ? getTextContent(val.properties.title) : 'No Title'
                console.log('Title:', title)

                if (summaryKey) {
                    const summaryVal = val.properties?.[summaryKey]
                    const summaryText = summaryVal ? getTextContent(summaryVal) : 'EMPTY'
                    console.log(`Summary Value (${summaryKey}):`, summaryText)
                    console.log('Raw Property:', JSON.stringify(summaryVal))
                } else {
                    console.log('Summary Key not found in schema.')
                }
                count++
            }
        }
    })
}

debug()
