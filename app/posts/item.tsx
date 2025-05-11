import type { Post } from "contentlayer/generated";
import Link from "next/link";
import { Card } from "../components/card";

type Props = {
	slug: string;
	children: React.ReactNode;
};

export const Item: React.FC<Props> = ({ slug, children }) => {
	return (
		<Link href={`/posts/${slug}`}>
			<Card key={slug}>
				<article className="p-4 md:p-8">
					{children}
				</article>
			</Card>
		</Link>
	);
};
