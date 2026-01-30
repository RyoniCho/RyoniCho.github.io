import { NotionAPI } from 'notion-client';

async function main() {
    const notion = new NotionAPI();
    const pageId = '2f873e521efd80f89135c15c198b3bf2';

    try {
        console.log('Fetching page...');
        const recordMap = await notion.getPage(pageId);
        console.log('Success!');
        console.log('Block keys:', Object.keys(recordMap.block).length);
        console.log('Collection keys:', Object.keys(recordMap.collection || {}).length);
        console.log('Collection View keys:', Object.keys(recordMap.collection_view || {}).length);

        if (recordMap.collection) {
            const collectionId = Object.keys(recordMap.collection)[0];
            console.log('First Collection ID:', collectionId);
            const schema = recordMap.collection[collectionId].value.schema;
            console.log('Collection Schema:', JSON.stringify(schema, null, 2));
        }
    } catch (err) {
        console.error('Error fetching page:', err);
    }
}

main();
