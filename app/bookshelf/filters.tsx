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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-2">
                <span className="text-sm text-zinc-400">Type:</span>
                <Link
                    href={getFilterUrl(null, selectedTag)}
                    className={`text-sm px-3 py-1 rounded-full ${!selectedType
                        ? "bg-zinc-700 text-zinc-100"
                        : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800"
                        }`}
                >
                    All
                </Link>
                {types.map((bookType) => (
                    <Link
                        key={bookType}
                        href={getFilterUrl(bookType, selectedTag)}
                        className={`text-sm px-3 py-1 rounded-full ${selectedType === bookType
                            ? "bg-zinc-700 text-zinc-100"
                            : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800"
                            }`}
                    >
                        {bookType}
                    </Link>
                ))}
            </div>

            <div className="flex flex-wrap gap-2">
                <span className="text-sm text-zinc-400">Tag:</span>
                <Link
                    href={getFilterUrl(selectedType, null)}
                    className={`text-sm px-3 py-1 rounded-full ${!selectedTag
                        ? "bg-zinc-700 text-zinc-100"
                        : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800"
                        }`}
                >
                    All
                </Link>
                {tags.map((tag) => (
                    <Link
                        key={tag}
                        href={getFilterUrl(selectedType, tag)}
                        className={`text-sm px-3 py-1 rounded-full ${selectedTag === tag
                            ? "bg-zinc-700 text-zinc-100"
                            : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800"
                            }`}
                    >
                        {tag}
                    </Link>
                ))}
            </div>
        </div>
    );
} 