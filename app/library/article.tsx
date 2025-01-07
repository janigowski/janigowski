import type { Book } from "@/.contentlayer/generated";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

export default function Article({ book }: { book: Book }) {
	const formattedDate = book.date
		? new Date(book.date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
		: '';

	const hasReview = book.status === 'read' && book.body.raw.trim().length > 0;

	return (
		<article className="group relative flex items-start gap-8 py-10 first:pt-0 last:pb-0">
			{/* Cover */}
			<div className="relative aspect-[2/3] w-28 flex-none overflow-hidden">
				<Image
					src={book.cover}
					alt={book.title}
					className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 will-change-transform group-hover:scale-105"
					width={400}
					height={600}
				/>
			</div>

			{/* Content */}
			<div className="flex flex-col flex-auto min-w-0">
				<div className="flex items-center gap-4 text-xs">
					<span className={clsx(
						'px-2 py-1 text-xs font-medium',
						{
							'bg-emerald-500/10 text-emerald-400': book.status === 'read',
							'bg-blue-500/10 text-blue-400': book.status === 'reading',
							'bg-zinc-500/10 text-white/60': book.status === 'waiting',
						}
					)}>
						{book.status}
					</span>
					<span className="bg-zinc-800 px-2 py-1 text-xs font-medium text-white/60">
						{book.bookType}
					</span>
					{hasReview && (
						<Link
							href={`/library/${book.slug}`}
							className="group/link ml-auto inline-flex items-center gap-2 text-xs font-medium text-white hover:text-white/80 transition-colors duration-200"
						>
							Read review
							<span className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
						</Link>
					)}
				</div>

				<h2 className="mt-4 text-xl font-medium text-white leading-tight line-clamp-2">
					{book.title}
				</h2>

				<p className="mt-2 text-base text-white/60">
					{book.author}
				</p>

				<div className="mt-4 flex items-center gap-4">
					{formattedDate && (
						<time className="text-sm text-white/40" dateTime={book.date}>
							{formattedDate}
						</time>
					)}
					{book.tag && (
						<span className="text-sm text-white/40">
							{book.tag}
						</span>
					)}
				</div>
			</div>
		</article>
	);
}
