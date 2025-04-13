import React from "react";
import AnimatedTitle from "../../components/AnimatedTitle";

interface Props {
	post: {
		title: string;
		date?: string;
		description: string;
	};
}

export const Header: React.FC<Props> = ({ post }) => {
	const formattedDate = post.date
		? new Date(post.date).toLocaleDateString('en-US', {
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
						<AnimatedTitle text={post.title} />
						{formattedDate && (
							<time className="mt-4 block text-sm text-zinc-400" dateTime={post.date}>
								{formattedDate}
							</time>
						)}
						<p className="mt-6 text-lg leading-8 text-zinc-400">
							{post.description}
						</p>
					</div>
				</div>
			</div>
		</header>
	);
}
