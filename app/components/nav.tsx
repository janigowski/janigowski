"use client";
import { Hexagon, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const links = [
	{ href: "/projects", label: "Projects" },
	{ href: "/profile", label: "Profile" },
	{ href: "/posts", label: "Posts" },
	{ href: "/library", label: "Library" },
	{ href: "/speaking", label: "Speaking" },
	{ href: "/mentoring", label: "Mentoring" },
	{ href: "/lamp", label: "Lamp" },
	{ href: "/contact", label: "Contact" },
];

const useIntersectionObserver = (ref: React.RefObject<HTMLElement>) => {
	const [isIntersecting, setIntersecting] = useState(true);

	useEffect(() => {
		if (!ref.current) return;

		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, [ref]);

	return isIntersecting;
};

const useClickOutside = (
	isOpen: boolean,
	onClose: () => void,
	excludeRefs: React.RefObject<HTMLElement>[]
) => {
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const clickedOutside = excludeRefs.every(
				ref => ref.current && !ref.current.contains(event.target as Node)
			);

			if (clickedOutside) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, onClose, excludeRefs]);
};

const NavigationLink: React.FC<{
	href: string;
	onClick?: () => void;
	children: React.ReactNode;
	isMobile?: boolean;
}> = ({
	href,
	children,
	onClick,
	isMobile = false,
}) => (
		<Link
			href={href}
			className={`duration-200 text-zinc-400 hover:text-zinc-100 ${isMobile ? 'block' : ''}`}
			onClick={onClick}
		>
			{children}
		</Link>
	);

const DesktopNavigation = () => (
	<div className="hidden md:flex justify-around gap-8 text-sm">
		{links.map(({ href, label }) => (
			<NavigationLink key={href} href={href}>
				{label}
			</NavigationLink>
		))}
	</div>
);

const MobileNavigation: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
	isOpen,
	onClose,
}) => {
	if (!isOpen) return null;

	return (
		<div className="md:hidden px-6 pb-6 space-y-4">
			{links.map(({ href, label }) => (
				<NavigationLink key={href} href={href} onClick={onClose} isMobile>
					{label}
				</NavigationLink>
			))}
		</div>
	);
};

export const Navigation: React.FC = () => {
	const headerRef = useRef<HTMLElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const isIntersecting = useIntersectionObserver(headerRef);
	useClickOutside(isMenuOpen, () => setIsMenuOpen(false), [menuRef, buttonRef]);

	const getBackgroundColor = () => {
		if (isMenuOpen) return "bg-zinc-900/95";
		return isIntersecting ? "bg-zinc-800/40" : "bg-zinc-800/70";
	};

	return (
		<header ref={headerRef}>
			<div
				ref={menuRef}
				className={`mx-auto sm:container fixed top-4 inset-x-4 sm:inset-x-0 z-50 rounded-2xl shadow-[inset_0_1px_1px_0_hsla(0,0%,100%,.15)] border border-white/10 backdrop-blur duration-200 ${getBackgroundColor()}`}
			>
				<div className="flex items-center justify-between p-6">
					<Link
						href="/"
						className="duration-200 text-zinc-300 hover:text-zinc-100"
					>
						<Hexagon className="w-6 h-6" />
					</Link>

					<DesktopNavigation />

					<button
						ref={buttonRef}
						className="md:hidden text-zinc-400 hover:text-zinc-100"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						{isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
					</button>
				</div>

				<MobileNavigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
			</div>
		</header>
	);
};
