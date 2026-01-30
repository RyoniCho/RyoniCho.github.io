import Link from 'next/link'
import { Post } from '@/lib/notion'

const PostCard = ({ post }: { post: Post }) => {
    const date = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })

    return (
        <Link href={`/blog/${post.id}`} className="group block focus:outline-none">
            <div className="curiosity-card relative h-full bg-white dark:bg-card-dark rounded-xl overflow-hidden border border-slate-200 dark:border-accent-gray/50 transition-all duration-300 p-6 hover:shadow-xl hover:-translate-y-1">

                {/* Header: Title & Date */}
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-slate-900 dark:text-white text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                    </h3>
                    <span className="text-slate-400 font-mono text-xs whitespace-nowrap pt-1 ml-4 shrink-0">
                        {date}
                    </span>
                </div>

                {/* Reveal Content (Description + Tags) */}
                <div className="reveal-content">
                    <p className="text-slate-600 dark:text-[#92a4c9] mb-4 text-sm line-clamp-3">
                        {post.summary || post.slug || "Click to read more about this topic..."}
                    </p>

                    <div className="flex items-center gap-4 mt-auto">
                        <div className="flex flex-wrap gap-2">
                            {post.category && (
                                <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-accent-gray/50 px-2 py-0.5 rounded border border-slate-200 dark:border-transparent">
                                    #{post.category}
                                </span>
                            )}
                            {post.tags?.slice(0, 1).map(tag => (
                                <span key={tag} className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-accent-gray/50 px-2 py-0.5 rounded border border-slate-200 dark:border-transparent">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        <div className="ml-auto flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                            Read <span className="text-lg">→</span>
                        </div>
                    </div>
                </div>

                {/* Hover Border Effect using CSS in globals */}
            </div>
        </Link>
    )
}

export default PostCard
