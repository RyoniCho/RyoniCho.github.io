import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@/lib/notion'

const PostCard = ({ post }: { post: Post }) => {
    const date = new Date(post.date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <Link href={`/blog/${post.id}`} className="group relative block h-full">
            <div className="relative h-full overflow-hidden rounded-2xl bg-white/5 border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/10 dark:bg-zinc-900/50">

                {/* Image / Gradient Placeholder */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                    {post.cover ? (
                        <img
                            src={post.cover}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20">
                            ✍️
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                </div>

                {/* Content */}
                <div className="p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                        {post.category && (
                            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-500 ring-1 ring-inset ring-blue-500/20">
                                {post.category}
                            </span>
                        )}
                        {post.tags?.slice(0, 2).map(tag => (
                            <span key={tag} className="inline-flex items-center rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-medium text-purple-400 ring-1 ring-inset ring-purple-500/20">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <h2 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors group-hover:text-blue-400">
                        {post.title}
                    </h2>

                    <div className="flex items-center gap-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <time dateTime={post.date}>{date}</time>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PostCard
