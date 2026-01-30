import { getPosts, getPage } from '@/lib/notion'
import { rootNotionPageId } from '@/config'
import PostList from '@/components/PostList'
import Link from 'next/link'
import { getTextContent } from 'notion-utils'

export default async function Home() {
  const posts = await getPosts(rootNotionPageId)

  // Separate the first post as featured (if at least one exists)
  const featuredPost = posts.length > 0 ? posts[0] : null
  const remainingPosts = posts.length > 0 ? posts.slice(1) : []

  // Smart Fallback for Featured Post (Fetch content if missing cover/summary)
  if (featuredPost) {
    if (!featuredPost.cover || !featuredPost.summary) {
      try {
        // We need to fetch the detailed page content (blocks)
        const recordMap = await getPage(featuredPost.id)
        const blocks = Object.values(recordMap.block)

        // 1. Fallback Cover: Find first image in content
        if (!featuredPost.cover) {
          const imageBlock = blocks.find(b => b?.value?.type === 'image')
          if (imageBlock) {
            const src = imageBlock.value.properties?.source?.[0]?.[0]
            if (src) {
              let fullUrl = src
              if (src.startsWith('/')) {
                fullUrl = `https://www.notion.so${src}`
              }
              featuredPost.cover = `https://www.notion.so/image/${encodeURIComponent(fullUrl)}?table=block&id=${imageBlock.value.id}&cache=v2`
            }
          }
        }

        // 2. Fallback Summary: Find first paragraph text
        if (!featuredPost.summary) {
          const textBlock = blocks.find(b =>
            b?.value?.type === 'text' &&
            b.value.properties?.title &&
            b.value.id !== featuredPost.id // Not the page itself
          )
          if (textBlock) {
            featuredPost.summary = getTextContent(textBlock.value.properties.title).slice(0, 150) + "..."
          }
        }
      } catch (e) {
        console.error("Failed to fetch featured post details for fallback", e)
      }
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">

      {/* Hero Header */}
      <header className="mb-12">
        <p className="text-slate-500 dark:text-[#92a4c9] font-mono text-xs uppercase tracking-[0.3em] mb-4">
          Game Client Developer & Hobbyist
        </p>
        <h1 className="text-slate-900 dark:text-white tracking-tight text-4xl md:text-5xl font-bold leading-tight pb-4">
          Building Worlds with Code,<br />Filling Life with Magic.
        </h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-10 items-start">

        {/* Main Content Column */}
        <div className="flex-1 w-full lg:max-w-[70%]">

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-10">
            {['Unity', 'GameDev', 'Magic', 'Drawing', 'Locking', 'Essays'].map(tag => (
              <span key={tag} className="px-4 py-1.5 rounded-full bg-slate-200 dark:bg-accent-gray text-[10px] font-mono font-medium hover:bg-primary/20 hover:text-primary transition-all cursor-pointer text-slate-600 dark:text-slate-400">
                #{tag}
              </span>
            ))}
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <section className="mb-12">
              <Link href={`/blog/${featuredPost.id}`} className="block curiosity-card group relative bg-white dark:bg-card-dark rounded-xl overflow-hidden border border-slate-200 dark:border-accent-gray/30 transition-all duration-300 p-6">
                <div className="flex flex-col gap-6">
                  {/* Featured Image */}
                  <div className="w-full aspect-[21/9] bg-slate-200 dark:bg-accent-gray rounded-lg overflow-hidden relative">
                    {featuredPost.cover && (
                      <img
                        src={featuredPost.cover}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    )}
                  </div>

                  <div>
                    <span className="text-primary font-mono text-xs font-bold mb-2 block uppercase tracking-tighter">
                      Featured Article
                    </span>
                    <h2 className="text-slate-900 dark:text-white text-2xl md:text-3xl font-bold leading-tight mb-4 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <div className="reveal-content flex flex-col gap-4">
                      <p className="text-slate-600 dark:text-[#92a4c9] text-base leading-relaxed line-clamp-2">
                        {featuredPost.summary || featuredPost.slug || "Click to read full article..."}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-slate-500 font-mono text-xs">
                          {new Date(featuredPost.date).toLocaleDateString()}
                        </span>
                        <span className="text-primary font-bold">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Remaining Posts List */}
          <PostList initialPosts={remainingPosts} />

        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-[30%] sticky top-28 flex flex-col gap-6">

          {/* Ad Unit */}
          <div className="bg-slate-100 dark:bg-card-dark border border-slate-200 dark:border-accent-gray/50 rounded-xl overflow-hidden hidden md:block">
            <div className="px-4 py-1.5 border-b border-slate-200 dark:border-accent-gray/50 flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Sponsored</span>
              <span className="text-xs text-slate-500">ℹ</span>
            </div>
            <div className="min-h-[300px] flex items-center justify-center p-6 text-center bg-slate-50 dark:bg-[#0f1115]">
              {/* Google AdSense or Placeholder */}
              <div className="text-slate-400 text-xs">
                Ad Space
              </div>
            </div>
          </div>

          {/* Support / Profile Widget */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20">
                <img src="/assets/images/main_blog/Profile.jpg" alt="Ryoni" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest block">Author</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Ryoni Cho</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-[#92a4c9] mb-4">
              Unity Client Developer.<br />
              Loves Magic, Drawing, Locking, and Writing.
            </p>
            <button className="w-full bg-primary text-white py-3 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all">
              More About Me
            </button>
          </div>

        </aside>

      </div>

    </main>
  );
}
