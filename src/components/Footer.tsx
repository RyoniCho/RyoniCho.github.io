export function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                <p className="text-center text-xs leading-5 text-gray-500">
                    &copy; {new Date().getFullYear()} Ryoni Cho. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
