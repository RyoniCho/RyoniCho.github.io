import { getPosts } from '@/lib/notion'
import { rootNotionPageId } from '@/config'
import PostCard from '@/components/PostCard'

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

      {/* Grid Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No posts found. Please verify the connection.
          </div>
        )}
      </div>
    </main>
  );
}
