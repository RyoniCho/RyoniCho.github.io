import { getPage, getPosts } from '@/lib/notion'
import { rootNotionPageId } from '@/config'
import { NotionPage } from '@/components/NotionPage'



export async function generateStaticParams() {
    const posts = await getPosts(rootNotionPageId)
    return posts.map((post) => ({
        slug: post.id,
    }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    // Fetch the specific post page
    const recordMap = await getPage(slug)

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-black/80">
                <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                    <a href="/" className="font-bold text-gray-900 dark:text-gray-100 mr-8">
                        Ryoni Blog
                    </a>
                </div>
            </header>

            <article className="mx-auto max-w-4xl py-10 px-4 sm:px-6 lg:px-8">
                <NotionPage recordMap={recordMap} rootPageId={rootNotionPageId} />
            </article>
        </div>
    )
}
