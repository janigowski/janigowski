"use client";
import { ArrowLeft, Eye, Github, Twitter } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

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
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);

	const formattedDate = book.date
		? new Date(book.date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
		: '';

	const links: { label: string; href: string }[] = [];
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
					: "bg-zinc-900/50 border-brand-olive/20"
					}`}
			>
				<div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
					<div className="flex justify-between gap-8">
						<Link
							target="_blank"
							href="https://x.com/janigowski"
							className={`duration-200 hover:font-medium ${isIntersecting
								? "text-brand-olive hover:text-brand-lime"
								: "text-brand-olive hover:text-brand-lime"
								}`}
						>
							<Twitter className="w-6 h-6" />
						</Link>
						<Link
							target="_blank"
							href="https://github.com/janigowski"
							className={`duration-200 hover:font-medium ${isIntersecting
								? "text-brand-olive hover:text-brand-lime"
								: "text-brand-olive hover:text-brand-lime"
								}`}
						>
							<Github className="w-6 h-6" />
						</Link>
					</div>

					<Link
						href="/library"
						className={`duration-200 hover:font-medium ${isIntersecting
							? "text-brand-olive hover:text-brand-lime"
							: "text-brand-olive hover:text-brand-lime"
							}`}
					>
						<ArrowLeft className="w-6 h-6" />
					</Link>
				</div>
			</div>
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

					<div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
						<div className="grid grid-cols-1 gap-y-6 gap-x-8 text-base font-semibold leading-7 text-brand-lime sm:grid-cols-2 md:flex lg:gap-x-10">
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
