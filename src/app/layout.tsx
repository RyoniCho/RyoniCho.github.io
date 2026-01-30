import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// core styles for react-notion-x
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'

import './globals.css'
import { Header } from '@/components/Header'
import Footer from '@/components/Footer'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ryoni Blog',
  description: 'Tech, Life, and Magic',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8494787667488340"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
