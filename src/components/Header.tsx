import Link from 'next/link'

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/70 backdrop-blur-md dark:border-gray-800 dark:bg-black/70">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                <div className="flex items-center gap-x-8">
                    <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-80 transition-opacity">
                        Ryoni Blog ✦
                    </Link>
                    <nav className="hidden md:flex gap-x-6 text-sm font-medium text-gray-700 dark:text-gray-200">
                        <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
                        {/* Add more links later if needed */}
                    </nav>
                </div>
                <div className="flex items-center gap-x-4">
                    {/* Social Links or Search could go here */}
                </div>
            </div>
        </header>
    )
}
