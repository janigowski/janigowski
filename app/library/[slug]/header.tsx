import React from "react";

type Props = {
	book: {
		title: string;
		author: string;
		tag?: string;
		date?: string;
		status: 'read' | 'reading' | 'waiting';
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

	return (
		<header className="relative isolate overflow-hidden">
			<div className="container mx-auto relative isolate overflow-hidden py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
					<div className="mx-auto max-w-2xl lg:mx-0">
						<div className="flex items-center justify-center gap-4 mb-6">
							<span className={`px-2 py-1 text-xs font-medium rounded-md ${book.status === 'read' ? 'bg-brand-lime/10 text-brand-lime' :
								book.status === 'reading' ? 'bg-brand-indigo/10 text-brand-indigo' :
									'bg-brand-olive/10 text-brand-olive'
								}`}>
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
					</div>
				</div>
			</div>
		</header>
	);
}