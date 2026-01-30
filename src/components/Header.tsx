import Link from 'next/link'

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-background-light/80 backdrop-blur-md dark:border-accent-gray dark:bg-background-dark/80 transition-colors">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-primary p-1.5 rounded-lg group-hover:bg-blue-600 transition-colors">
                            {/* Material Symbol equivalent using basic SVG for simplicity */}
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3" />
                            </svg>
                        </div>
                        <span className="font-mono font-bold tracking-tighter text-xl text-slate-800 dark:text-white">
                            DEV.ARCH
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-sm font-medium font-mono text-slate-600 dark:text-[#92a4c9] hover:text-primary dark:hover:text-primary transition-colors">
                            Articles
                        </Link>
                        {/* 
                        <Link href="/snippets" className="text-sm font-medium font-mono text-slate-600 dark:text-[#92a4c9] hover:text-primary dark:hover:text-primary transition-colors">
                            Snippet Lab
                        </Link>
                        */}
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    {/* Search Placeholder */}
                    <button className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-accent-gray rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                    {/* Subscribe Button Style */}
                    <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                        Subscribe
                    </button>
                </div>
            </div>
        </header>
    )
}
