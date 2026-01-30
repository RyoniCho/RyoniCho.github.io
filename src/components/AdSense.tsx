'use client'

import { useEffect } from 'react'

interface AdSenseProps {
    pId: string
    slotId: string
    format?: string
    fullWidthResponsive?: string
    style?: React.CSSProperties
}

export default function AdSense({ pId, slotId, format = 'auto', fullWidthResponsive = 'true', style = { display: 'block' } }: AdSenseProps) {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error(err);
        }
    }, []);

    return (
        <div className="ad-container overflow-hidden">
            <ins
                className="adsbygoogle"
                style={style}
                data-ad-client={pId}
                data-ad-slot={slotId}
                data-ad-format={format}
                data-full-width-responsive={fullWidthResponsive}
            />
        </div>
    );
}
