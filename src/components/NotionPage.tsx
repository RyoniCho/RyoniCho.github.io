'use client'

import * as React from 'react'
import { NotionRenderer } from 'react-notion-x'
import { ExtendedRecordMap } from 'notion-types'
import dynamic from 'next/dynamic'

const Code = dynamic(() =>
    import('react-notion-x/build/third-party/code').then((m) => m.Code)
)
const Collection = dynamic(() =>
    import('react-notion-x/build/third-party/collection').then((m) => m.Collection)
)
const Equation = dynamic(() =>
    import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)
const Modal = dynamic(
    () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
    { ssr: false }
)

const CustomImage = (props: any) => {
    // Determine src
    const src = props.src || props.url
    // If it's a relative URL, just render it. 
    return <img {...props} src={src} loading="lazy" />
}

export const NotionPage = ({
    recordMap,
    rootPageId
}: {
    recordMap: ExtendedRecordMap
    rootPageId?: string
}) => {
    if (!recordMap) {
        return null
    }

    return (
        <NotionRenderer
            recordMap={recordMap}
            fullPage={true}
            darkMode={false}
            rootPageId={rootPageId}
            mapImageUrl={(url, block) => {
                if (!url) return ''

                // 1. Handle Notion Signed URLs (uploaded/imported images) & S3 URLs
                // If it starts with 'attachment' (Notion internal) or 'https://file.notion.so' (S3),
                // or even just standard S3 links, we should proxy them through Notion to get a fresh link via the public page.
                if (url.startsWith('attachment') || url.includes('file.notion.so') || url.includes('s3.us-west-2.amazonaws.com')) {
                    // Start with the raw URL (which might be the expired one, but that's fine as the ID reference)
                    const sourceUrl = recordMap.signed_urls?.[block.id] || url

                    // Proxy URL format: https://www.notion.so/image/{ENCODED_URL}?table=block&id={BLOCK_ID}&cache=v2
                    return `https://www.notion.so/image/${encodeURIComponent(sourceUrl)}?table=block&id=${block.id}&cache=v2`
                }

                // 2. Handle Local Assets (relative paths)
                if (url.startsWith('/')) {
                    return `https://ryonicho.github.io${url}`
                }

                return url
            }}
            components={{
                Code,
                Collection,
                Equation,
                Modal,
                Image: CustomImage
            }}
        />
    )
}
