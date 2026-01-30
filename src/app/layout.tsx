import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
// core styles for react-notion-x
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'

import './globals.css'
import { Header } from '@/components/Header'
import Footer from '@/components/Footer'
import Script from 'next/script'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

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
        <meta name="referrer" content="no-referrer" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8494787667488340"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
