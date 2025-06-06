import type { Post as PostType } from "contentlayer/generated";

type Props = {
	post: PostType;
};

export const Post: React.FC<Props> = ({ post }) => {
	return (
		<>
			<div className="flex justify-between gap-2 items-center">
				<span className="text-xs duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
					{post.date ? (
						<time dateTime={new Date(post.date).toISOString()}>
							{Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
								new Date(post.date),
							)}
						</time>
					) : (
						<span>SOON</span>
					)}
				</span>
			</div>
			<h2 className="z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
				{post.title}
			</h2>
			<p className="z-20 mt-4 text-sm  duration-1000 text-zinc-400 group-hover:text-zinc-200">
				{post.description}
			</p>
		</>
	);
};
