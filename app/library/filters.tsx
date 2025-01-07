'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Props = {
    types: string[];
    tags: string[];
    selectedType?: string;
    selectedTag?: string;
};

export function BookFilters({ types, tags, selectedType, selectedTag }: Props) {
    const searchParams = useSearchParams();

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

    return (
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-zinc-300">Type</h3>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href={getFilterUrl(null, selectedTag)}
                        className={`text-sm px-4 py-1.5 rounded-full transition-all duration-300 ${!selectedType
                                ? "bg-zinc-700/90 text-zinc-100 shadow-lg shadow-zinc-900/20"
                                : "bg-zinc-800/40 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-300"
                            }`}
                    >
                        All
                    </Link>
                    {types.map((bookType) => (
                        <Link
                            key={bookType}
                            href={getFilterUrl(bookType, selectedTag)}
                            className={`text-sm px-4 py-1.5 rounded-full transition-all duration-300 ${selectedType === bookType
                                    ? "bg-zinc-700/90 text-zinc-100 shadow-lg shadow-zinc-900/20"
                                    : "bg-zinc-800/40 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-300"
                                }`}
                        >
                            {bookType}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-medium text-zinc-300">Tag</h3>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href={getFilterUrl(selectedType, null)}
                        className={`text-sm px-4 py-1.5 rounded-full transition-all duration-300 ${!selectedTag
                                ? "bg-zinc-700/90 text-zinc-100 shadow-lg shadow-zinc-900/20"
                                : "bg-zinc-800/40 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-300"
                            }`}
                    >
                        All
                    </Link>
                    {tags.map((tag) => (
                        <Link
                            key={tag}
                            href={getFilterUrl(selectedType, tag)}
                            className={`text-sm px-4 py-1.5 rounded-full transition-all duration-300 ${selectedTag === tag
                                    ? "bg-zinc-700/90 text-zinc-100 shadow-lg shadow-zinc-900/20"
                                    : "bg-zinc-800/40 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-300"
                                }`}
                        >
                            {tag}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
} 