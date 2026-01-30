import { NotionAPI } from 'notion-client';

async function main() {
    const notion = new NotionAPI();
    const pageId = '2f873e52-1efd-8118-bbfd-cf726dbb70ad';

    try {
        console.log('Fetching post...');
        const recordMap = await notion.getPage(pageId);

        // Check signed_urls
        console.log('Signed URLs keys:', Object.keys(recordMap.signed_urls || {}));

        // Find image blocks
        if (recordMap.block) {
            Object.values(recordMap.block).forEach(block => {
                if (block.value && block.value.type === 'image') {
                    console.log('--- Image Block ---');
                    console.log('ID:', block.value.id);
                    console.log('Source:', block.value.properties?.source?.[0]?.[0]);
                    console.log('Signed URL entry:', recordMap.signed_urls?.[block.value.id]);
                }
            });
        }

    } catch (err) {
        console.error('Error fetching page:', err);
    }
}

main();
