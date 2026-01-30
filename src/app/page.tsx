import { getPosts } from '@/lib/notion'
import { rootNotionPageId } from '@/config'
import PostList from '@/components/PostList'

export default async function Home() {
  const posts = await getPosts(rootNotionPageId)

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100">

      {/* Hero Section */}
      <div className="relative isolate overflow-hidden pt-14 pb-10 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-6">
            Ryoni Blog.
          </h1>
          <p className="text-lg leading-8 text-gray-600 dark:text-gray-300">
            Tech, Life, and Magic.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <PostList initialPosts={posts} />

    </main>
  );
}
