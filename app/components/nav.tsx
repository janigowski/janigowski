"use client";
import { Hexagon, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export const Navigation: React.FC = () => {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return (
		<header ref={ref}>
			<div
				className={`mx-auto sm:container fixed top-4 inset-x-4 sm:inset-x-0 z-50 rounded-2xl shadow-[inset_0_1px_1px_0_hsla(0,0%,100%,.15)] border border-white/10 backdrop-blur duration-200 ${isMenuOpen
					? "bg-zinc-900/95"
					: isIntersecting
						? "bg-zinc-800/40"
						: "bg-zinc-800/70"
					}`}
			>
				<div className="flex items-center justify-between p-6">
					<Link
						href="/"
						className="duration-200 text-zinc-300 hover:text-zinc-100"
					>
						<Hexagon className="w-6 h-6" />
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex justify-around gap-8 text-sm">
						<Link
							href="/projects"
							className="duration-200 text-zinc-400 hover:text-zinc-100"
						>
							Projects
						</Link>
						<Link
							href="/posts"
							className="duration-200 text-zinc-400 hover:text-zinc-100"
						>
							Posts
						</Link>
						<Link
							href="/library"
							className="duration-200 text-zinc-400 hover:text-zinc-100"
						>
							Library
						</Link>
						<Link
							href="/speaking"
							className="duration-200 text-zinc-400 hover:text-zinc-100"
						>
							Speaking
						</Link>
						<Link
							href="/mentoring"
							className="duration-200 text-zinc-400 hover:text-zinc-100"
						>
							Mentoring
						</Link>
						<Link
							href="/contact"
							className="duration-200 text-zinc-400 hover:text-zinc-100"
						>
							Contact
						</Link>
					</div>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden text-zinc-400 hover:text-zinc-100"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						{isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
					</button>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className="md:hidden px-6 pb-6 space-y-4">
						<Link
							href="/projects"
							className="block duration-200 text-zinc-400 hover:text-zinc-100"
							onClick={() => setIsMenuOpen(false)}
						>
							Projects
						</Link>
						<Link
							href="/posts"
							className="block duration-200 text-zinc-400 hover:text-zinc-100"
							onClick={() => setIsMenuOpen(false)}
						>
							Posts
						</Link>
						<Link
							href="/library"
							className="block duration-200 text-zinc-400 hover:text-zinc-100"
							onClick={() => setIsMenuOpen(false)}
						>
							Library
						</Link>
						<Link
							href="/speaking"
							className="block duration-200 text-zinc-400 hover:text-zinc-100"
							onClick={() => setIsMenuOpen(false)}
						>
							Speaking
						</Link>
						<Link
							href="/mentoring"
							className="block duration-200 text-zinc-400 hover:text-zinc-100"
							onClick={() => setIsMenuOpen(false)}
						>
							Mentoring
						</Link>
						<Link
							href="/contact"
							className="block duration-200 text-zinc-400 hover:text-zinc-100"
							onClick={() => setIsMenuOpen(false)}
						>
							Contact
						</Link>
					</div>
				)}
			</div>
		</header>
	);
};
