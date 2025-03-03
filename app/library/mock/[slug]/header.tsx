import Image from "next/image";
import React from "react";

type Props = {
	book: {
		title: string;
		author: string;
		tag?: string;
		date?: string;
		status: 'read' | 'reading' | 'waiting' | 'listened' | 'listening' | 'paused';
		cover: string;
	};
};

export const Header: React.FC<Props> = ({ book }) => {
	const formattedDate = book.date
		? new Date(book.date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
		: '';

	const isInProgress = book.status === 'reading' || book.status === 'listening';
	const statusClass = {
		'read': 'bg-brand-lime/10 text-brand-lime',
		'listened': 'bg-brand-lime/10 text-brand-lime',
		'reading': 'bg-brand-indigo/10 text-brand-indigo',
		'listening': 'bg-brand-indigo/10 text-brand-indigo',
		'waiting': 'bg-brand-olive/10 text-brand-olive',
		'paused': 'bg-brand-olive/10 text-brand-olive',
	}[book.status] || 'bg-brand-olive/10 text-brand-olive';

	return (
		<header className="relative isolate overflow-hidden">
			<div className="container mx-auto relative isolate overflow-hidden py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
					<div className="mx-auto max-w-2xl lg:mx-0">
						<div className="flex items-center justify-center gap-4 mb-6">
							<span className={`px-2 py-1 text-xs font-medium rounded-md transition-opacity duration-1000 ${statusClass} ${isInProgress ? 'animate-pulse' : ''}`}>
								{book.status}
							</span>
							{book.tag && (
								<span className="bg-brand-purple-darker/10 px-2 py-1 text-xs font-medium text-brand-olive rounded-md">
									{book.tag}
								</span>
							)}
						</div>
						<h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-display">
							{book.title}
						</h1>
						<p className="mt-4 text-lg font-medium text-brand-olive">
							{book.author}
						</p>
						{formattedDate && (
							<time className="mt-2 block text-sm text-brand-olive/80" dateTime={book.date}>
								{formattedDate}
							</time>
						)}

						<div className="mt-8">
							<Image
								src={book.cover}
								alt={book.title}
								className="absolute inset-0 h-full w-full object-contain transition-transform duration-300 will-change-transform group-hover:scale-105"
								width={400}
								height={600}
							/>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}