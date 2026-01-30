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

                // 1. Handle Notion Signed URLs (uploaded/imported images)
                if (url.startsWith('attachment')) {
                    const signedUrl = recordMap.signed_urls?.[block.id]
                    if (signedUrl) return signedUrl
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
