import type { Book } from "@/.contentlayer/generated";
import Link from "next/link";
import Image from "next/image";

type Props = {
	book: Book;
};

export const Article: React.FC<Props> = ({ book }) => {
	const hasContent = book.body.raw.trim().length > 0;

	return (
		<article className="relative group">
			{/* Card with hover effect */}
			<div className="absolute inset-0 bg-gradient-to-br from-zinc-800/30 via-zinc-900/20 to-zinc-900/30 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl" />

			<div className="relative flex gap-8 p-6 md:p-8">
				{/* Book cover with floating effect */}
				<div className="relative w-32 h-48 flex-shrink-0">
					<div className="absolute inset-0 transform group-hover:translate-y-[-4px] transition-transform duration-500">
						{book.cover ? (
							<>
								<Image
									src={book.cover}
									alt={`Cover of ${book.title}`}
									fill
									className="object-cover rounded-xl shadow-xl"
									sizes="(max-width: 768px) 100px, 150px"
								/>
								{/* Book glow effect */}
								<div className="absolute inset-0 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.4)] group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-shadow duration-500" />
							</>
						) : (
							<div className="w-full h-full rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center p-4 text-center shadow-xl">
								<span className="text-sm text-zinc-400 line-clamp-4">{book.title}</span>
							</div>
						)}
					</div>
				</div>

				{/* Content */}
				<div className="flex-1 min-w-0 flex flex-col">
					<div className="flex-1">
						<h2 className="text-xl font-medium lg:text-2xl text-zinc-100 group-hover:text-white transition-colors duration-300 font-display leading-tight line-clamp-2">
							{book.title}
						</h2>
						<p className="mt-1 text-base text-zinc-300 group-hover:text-zinc-200 transition-colors duration-300 font-medium">
							{book.author}
						</p>
					</div>

					<div className="mt-4 flex flex-wrap items-center gap-3">
						<div className="flex gap-2 flex-wrap">
							<span className={`text-xs px-3 py-1 rounded-full font-medium transition-all duration-300 ${book.status === 'read' ? 'bg-emerald-900/40 text-emerald-200 group-hover:bg-emerald-800/50' :
									book.status === 'reading' ? 'bg-blue-900/40 text-blue-200 group-hover:bg-blue-800/50 animate-[pulse_3s_ease-in-out_infinite]' :
										'bg-zinc-800/40 text-zinc-300 group-hover:bg-zinc-700/50'
								}`}>
								{book.status}
							</span>
							<span className="text-xs px-3 py-1 rounded-full bg-zinc-800/40 text-zinc-300 group-hover:bg-zinc-700/50 transition-colors duration-300">
								{book.bookType}
							</span>
							<span className="text-xs px-3 py-1 rounded-full bg-zinc-800/40 text-zinc-300 group-hover:bg-zinc-700/50 transition-colors duration-300">
								{book.tag}
							</span>
						</div>

						{book.date && (
							<span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors duration-300 ml-auto">
								<time dateTime={new Date(book.date).toISOString()}>
									{Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
										new Date(book.date),
									)}
								</time>
							</span>
						)}
					</div>

					{hasContent && (
						<Link
							href={`/library/${book.slug}`}
							className="inline-flex items-center mt-4 text-sm text-zinc-400 hover:text-white transition-all duration-300 group/link"
						>
							<span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 group-hover/link:after:scale-x-100">
								Read review
							</span>
							<span className="ml-1 transform transition-transform duration-300 group-hover/link:translate-x-1">→</span>
						</Link>
					)}
				</div>
			</div>
		</article>
	);
};
