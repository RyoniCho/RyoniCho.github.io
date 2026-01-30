import { getPosts } from '@/lib/notion'
import { rootNotionPageId } from '@/config'
import PostList from '@/components/PostList'
import Image from 'next/image'

export default async function Home() {
  const posts = await getPosts(rootNotionPageId)

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100">

      {/* Hero Section */}
      <div className="relative isolate overflow-hidden pt-14 pb-10 sm:py-20 bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-950/20 dark:to-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row items-center gap-10">

          {/* Profile Image */}
          <div className="relative shrink-0">
            <div className="relative h-32 w-32 md:h-40 md:w-40 overflow-hidden rounded-full border-4 border-white dark:border-gray-800 shadow-xl">
              {/* Local asset usage with standard img or next/image */}
              <Image
                src="/assets/images/main_blog/Profile.jpg"
                alt="Profile"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Introduction */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
              Ryoni Blog.
            </h1>
            <p className="text-xl font-medium text-gray-900 dark:text-gray-100">
              Game Client Developer
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              Amateur Magician 🎩
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-500 max-w-lg">
              Tech, Life, and Magic.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <PostList initialPosts={posts} />

    </main>
  );
}
