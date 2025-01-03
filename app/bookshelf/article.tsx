import type { Book } from "@/.contentlayer/generated";
import Link from "next/link";
import { Eye } from "lucide-react";

type Props = {
	book: Book;
};

export const Article: React.FC<Props> = ({ book }) => {
	return (
		<Link href={`/bookshelf/${book.slug}`}>
			<article className="p-4 md:p-8">
				<div className="flex justify-between gap-2 items-center">
					<span className="text-xs duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
						{book.date ? (
							<time dateTime={new Date(book.date).toISOString()}>
								{Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
									new Date(book.date),
								)}
							</time>
						) : (
							<span>SOON</span>
						)}
					</span>
				</div>
				<h2 className="z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
					{book.title}
				</h2>
				<p className="z-20 mt-4 text-sm duration-1000 text-zinc-400 group-hover:text-zinc-200">
					{book.description}
				</p>
			</article>
		</Link>
	);
};
