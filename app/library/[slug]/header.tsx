"use client";
import { ArrowLeft, Eye, Github, Twitter } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

type Props = {
	book: {
		url?: string;
		title: string;
		description: string;
		repository?: string;
	};
};
export const Header: React.FC<Props> = ({ book }) => {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);

	const links: { label: string; href: string }[] = [];
	if (book.repository) {
		links.push({
			label: "GitHub",
			href: `https://github.com/${book.repository}`,
		});
	}
	if (book.url) {
		links.push({
			label: "Website",
			href: book.url,
		});
	}
	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return (
		<header
			ref={ref}
			className="relative isolate overflow-hidden"
		>
			<div
				className={`fixed inset-x-0 top-0 z-[100] backdrop-blur duration-200 border-b ${isIntersecting
					? "bg-zinc-900/0 border-transparent"
					: "bg-zinc-900/50 border-zinc-700"
					}`}
			>
				<div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
					<div className="flex justify-between gap-8">
						<Link
							target="_blank"
							href="https://x.com/janigowski"
							className={`duration-200 hover:font-medium ${isIntersecting
								? "text-zinc-400 hover:text-zinc-100"
								: "text-zinc-400 hover:text-zinc-100"
								}`}
						>
							<Twitter className="w-6 h-6" />
						</Link>
						<Link
							target="_blank"
							href="https://github.com/janigowski"
							className={`duration-200 hover:font-medium ${isIntersecting
								? "text-zinc-400 hover:text-zinc-100"
								: "text-zinc-400 hover:text-zinc-100"
								}`}
						>
							<Github className="w-6 h-6" />
						</Link>
					</div>

					<Link
						href="/library"
						className={`duration-200 hover:font-medium ${isIntersecting
							? "text-zinc-400 hover:text-zinc-100"
							: "text-zinc-400 hover:text-zinc-100"
							}`}
					>
						<ArrowLeft className="w-6 h-6" />
					</Link>
				</div>
			</div>
			<div className="container mx-auto relative isolate overflow-hidden py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
					<div className="mx-auto max-w-2xl lg:mx-0">
						<h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-6xl font-display">
							{book.title}
						</h1>
						<p className="mt-6 text-lg leading-8 text-zinc-400">
							{book.description}
						</p>
					</div>

					<div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
						<div className="grid grid-cols-1 gap-y-6 gap-x-8 text-base font-semibold leading-7 text-zinc-100 sm:grid-cols-2 md:flex lg:gap-x-10">
							{links.map((link) => (
								<Link target="_blank" key={link.label} href={link.href}>
									{link.label} <span aria-hidden="true">&rarr;</span>
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};