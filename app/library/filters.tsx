'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { allBooks } from "contentlayer/generated";

type Props = {
    types: string[];
    tags: string[];
    selectedType?: string;
    selectedTag?: string;
};

export function BookFilters({ types, tags, selectedType, selectedTag }: Props) {
    const searchParams = useSearchParams();
    const books = allBooks.filter(b => b.published);

    function getFilterUrl(bookType: string | undefined | null, tag: string | undefined | null) {
        const params = new URLSearchParams(searchParams?.toString() || '');
        if (bookType === null || bookType === undefined) {
            params.delete('type');
        } else {
            params.set('type', bookType);
        }
        if (tag === null || tag === undefined) {
            params.delete('tag');
        } else {
            params.set('tag', tag);
        }
        return `?${params.toString()}`;
    }

    function getCountForType(type: string | null) {
        return type === null
            ? books.length
            : books.filter(book => book.bookType === type).length;
    }

    function getCountForTag(tag: string | null) {
        return tag === null
            ? books.length
            : books.filter(book => book.tag === tag).length;
    }

    return (
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
            <div className="space-y-3 flex-1">
                <h3 className="text-sm font-medium text-zinc-300">Type</h3>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href={getFilterUrl(null, selectedTag)}
                        className={`group text-sm px-4 py-2 rounded-xl transition-all duration-300 ${!selectedType
                            ? "bg-zinc-800/80 text-zinc-100 shadow-lg shadow-zinc-900/20"
                            : "bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-300"
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            All
                            <span className={`px-2 py-0.5 rounded-md text-xs transition-colors duration-300 ${!selectedType
                                ? "bg-zinc-700/80 text-zinc-300"
                                : "bg-zinc-800/80 text-zinc-500 group-hover:text-zinc-400"
                                }`}>
                                {getCountForType(null)}
                            </span>
                        </span>
                    </Link>
                    {types.map((bookType) => (
                        <Link
                            key={bookType}
                            href={getFilterUrl(bookType, selectedTag)}
                            className={`group text-sm px-4 py-2 rounded-xl transition-all duration-300 ${selectedType === bookType
                                ? "bg-zinc-800/80 text-zinc-100 shadow-lg shadow-zinc-900/20"
                                : "bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-300"
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                {bookType}
                                <span className={`px-2 py-0.5 rounded-md text-xs transition-colors duration-300 ${selectedType === bookType
                                    ? "bg-zinc-700/80 text-zinc-300"
                                    : "bg-zinc-800/80 text-zinc-500 group-hover:text-zinc-400"
                                    }`}>
                                    {getCountForType(bookType)}
                                </span>
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="space-y-3 flex-1">
                <h3 className="text-sm font-medium text-zinc-300">Tag</h3>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href={getFilterUrl(selectedType, null)}
                        className={`group text-sm px-4 py-2 rounded-xl transition-all duration-300 ${!selectedTag
                            ? "bg-zinc-800/80 text-zinc-100 shadow-lg shadow-zinc-900/20"
                            : "bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-300"
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            All
                            <span className={`px-2 py-0.5 rounded-md text-xs transition-colors duration-300 ${!selectedTag
                                ? "bg-zinc-700/80 text-zinc-300"
                                : "bg-zinc-800/80 text-zinc-500 group-hover:text-zinc-400"
                                }`}>
                                {getCountForTag(null)}
                            </span>
                        </span>
                    </Link>
                    {tags.map((tag) => (
                        <Link
                            key={tag}
                            href={getFilterUrl(selectedType, tag)}
                            className={`group text-sm px-4 py-2 rounded-xl transition-all duration-300 ${selectedTag === tag
                                ? "bg-zinc-800/80 text-zinc-100 shadow-lg shadow-zinc-900/20"
                                : "bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-300"
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                {tag}
                                <span className={`px-2 py-0.5 rounded-md text-xs transition-colors duration-300 ${selectedTag === tag
                                    ? "bg-zinc-700/80 text-zinc-300"
                                    : "bg-zinc-800/80 text-zinc-500 group-hover:text-zinc-400"
                                    }`}>
                                    {getCountForTag(tag)}
                                </span>
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
} 