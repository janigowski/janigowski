"use client";

import type { Book } from "contentlayer/generated";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { motion } from "framer-motion";

export default function Article({ book }: { book: Book }) {
	const formattedDate = book.date
		? new Date(book.date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
		: '';

	const hasReview = (book.status === 'read' || book.status === 'listened') && book.body.raw.trim().length > 0;
	const isInProgress = book.status === 'reading' || book.status === 'listening';
	const statusClass = {
		'read': 'bg-brand-lime/10 text-brand-lime',
		'listened': 'bg-brand-lime/10 text-brand-lime',
		'reading': 'bg-brand-indigo/10 text-brand-indigo animate-pulse',
		'listening': 'bg-brand-indigo/10 text-brand-indigo animate-pulse',
		'waiting': 'bg-brand-olive/10 text-brand-olive',
		'paused': 'bg-brand-olive/10 text-brand-olive',
	}[book.status] || 'bg-brand-olive/10 text-brand-olive';

	return (
		<motion.article
			className={clsx(
				"group relative flex items-start gap-8 py-10 first:pt-0 last:pb-0",
				hasReview && "bg-brand-purple-dark/5 -mx-6 px-6 rounded-2xl"
			)}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
		>
			{/* Cover */}
			<div className="relative aspect-[2/3] w-28 flex-none overflow-hidden rounded-lg">
				<Image
					src={book.cover}
					alt={book.title}
					className="absolute inset-0 h-full w-full object-contain transition-transform duration-300 will-change-transform group-hover:scale-105"
					width={400}
					height={600}
				/>
			</div>

			{/* Content */}
			<div className="flex flex-col flex-auto min-w-0">
				<div className="flex items-center gap-4 text-xs">
					<span className={clsx(
						'px-2 py-1 text-xs font-medium rounded-md transition-opacity duration-300',
						statusClass,
						isInProgress && 'animate-pulse'
					)}>
						{book.status}
					</span>
					<Link
						href={`/library?type=${book.bookType}`}
						className="bg-brand-purple-darker/10 px-2 py-1 text-xs font-medium text-brand-olive rounded-md hover:bg-brand-purple-darker/20 transition-colors duration-300"
					>
						{book.bookType}
					</Link>
					<Link href={`/library/mock/${book.slug}`}> _ </Link>
					{hasReview && (
						<Link
							href={`/library/${book.slug}`}
							className="group/link ml-auto inline-flex items-center gap-2 text-xs font-medium text-brand-lime hover:text-brand-lime/80 transition-colors duration-300"
						>
							Read review
							<span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
						</Link>
					)}
				</div>

				<h2 className="mt-4 text-xl font-medium text-white leading-tight line-clamp-2">
					{book.title}
				</h2>

				<p className="mt-2 text-base text-brand-olive">
					{book.author}
				</p>

				<div className="mt-4 flex items-center gap-4">
					{formattedDate && (
						<time className="text-sm text-brand-olive/80" dateTime={book.date}>
							{formattedDate}
						</time>
					)}
					{book.tag && (
						<Link
							href={`/library?tag=${book.tag}`}
							className="text-sm text-brand-olive/80 hover:text-brand-olive transition-colors duration-300"
						>
							{book.tag}
						</Link>
					)}
				</div>
			</div>
		</motion.article>
	);
}
