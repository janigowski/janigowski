import type { Book } from "@/.contentlayer/generated";
import Link from "next/link";
import Image from "next/image";

type Props = {
	book: Book;
};

export const Article: React.FC<Props> = ({ book }) => {
	const hasContent = book.body.raw.trim().length > 0;

	return (
		<article className="p-4 md:p-8 flex gap-4">
			{book.cover && (
				<div className="relative w-24 h-36 flex-shrink-0">
					<Image
						src={book.cover}
						alt={`Cover of ${book.title}`}
						fill
						className="object-cover rounded-md"
					/>
				</div>
			)}
			<div className="flex-1">
				<div className="flex justify-between gap-2 items-center">
					<div className="flex gap-2 items-center">
						{book.date && (
							<span className="text-xs duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
								<time dateTime={new Date(book.date).toISOString()}>
									{Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
										new Date(book.date),
									)}
								</time>
							</span>
						)}
						<span className={`text-xs px-2 py-1 rounded ${book.status === 'read' ? 'bg-green-900/50' :
							book.status === 'reading' ? 'bg-blue-900/50' :
								'bg-zinc-900/50'
							}`}>
							{book.status}
						</span>
						<span className="text-xs px-2 py-1 rounded bg-zinc-900/50">
							{book.bookType}
						</span>
					</div>
					<span className="text-xs px-2 py-1 rounded bg-zinc-900/50">
						{book.tag}
					</span>
				</div>
				<h2 className="z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
					{book.title}
				</h2>
				<p className="z-20 mt-4 text-sm duration-1000 text-zinc-400 group-hover:text-zinc-200">
					{book.description}
				</p>
				{hasContent && (
					<Link href={`/bookshelf/${book.slug}`} className="inline-block mt-4 text-sm text-zinc-400 hover:text-zinc-200">
						Read review →
					</Link>
				)}
			</div>
		</article>
	);
};
