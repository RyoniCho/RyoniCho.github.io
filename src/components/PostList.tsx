'use client'

import { useState, useMemo } from 'react'
import { Post } from '@/lib/notion'
import PostCard from '@/components/PostCard'
import Link from 'next/link'

interface PostListProps {
    initialPosts: Post[]
}

export default function PostList({ initialPosts }: PostListProps) {
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = new Set(initialPosts.map(p => p.category || 'Uncategorized'))
        return ['All', ...Array.from(cats)]
    }, [initialPosts])

    const filteredPosts = useMemo(() => {
        if (selectedCategory === 'All') return initialPosts
        return initialPosts.filter(p => p.category === selectedCategory)
    }, [initialPosts, selectedCategory])

    return (
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${selectedCategory === cat
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-400'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 rounded-lg p-1 self-start sm:self-auto">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'grid'
                            ? 'bg-white dark:bg-black shadow text-blue-500'
                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                            }`}
                        title="Grid View"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'list'
                            ? 'bg-white dark:bg-black shadow text-blue-500'
                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                            }`}
                        title="List View"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-2">
                    {filteredPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="flex flex-col gap-4">
                    {filteredPosts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.id}`}
                            className="group block p-4 rounded-xl bg-white/5 border border-black/5 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        {post.category && (
                                            <span className="text-xs font-semibold text-blue-500">
                                                {post.category}
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-400">
                                            {new Date(post.date).toLocaleDateString('ko-KR')}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold group-hover:text-blue-500 transition-colors">
                                        {post.title}
                                    </h3>
                                </div>
                                <div className="hidden sm:block">
                                    <span className="text-gray-400 group-hover:translate-x-1 transition-transform inline-block">→</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {filteredPosts.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    No posts found in this category.
                </div>
            )}
        </div>
    )
}
