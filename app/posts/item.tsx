import type { Post as PostType, Book as BookType } from "contentlayer/generated";
import Link from "next/link";
import { Card } from "../components/card";
import { Post } from "./post";
import BookArticle from "../library/article";

type Props = {
	item: PostType | BookType;
};

export const Item: React.FC<Props> = ({ item }) => {
	return (
		<Card key={item.slug}>
			<article className="p-4 md:p-8">
				{item.type === "Post" ? (
					<Link href={`/posts/${item.slug}`}>
						<Post post={item} />
					</Link>
				) : (
					<Link href={`/library/${item.slug}`}>
						<BookArticle book={item} />
					</Link>
				)}
			</article>
		</Card>
	);
};
