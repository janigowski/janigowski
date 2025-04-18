"use client";
import { Github, Mail, X, Linkedin } from "lucide-react";
import Link from "next/link";
import { Card } from "../components/card";
import { RegularHeader } from '../components/regular-header'
import StaggeredAnimation from '../components/StaggeredAnimation'

const socials = [
	{
		icon: <Mail size={20} />,
		href: "mailto:dawidjaniga@gmail.com",
		label: "Email",
		handle: "dawidjaniga@gmail.com",
	},
	{
		icon: <X size={20} />,
		href: "https://x.com/janigowski",
		label: "X",
		handle: "@janigowski",
	},
	{
		icon: <Github size={20} />,
		href: "https://github.com/janigowski",
		label: "Github",
		handle: "janigowski",
	},
	{
		icon: <Linkedin size={20} />,
		href: "https://linkedin.com/in/dawidjaniga",
		label: "LinkedIn",
		handle: "Dawid Janiga",
	},
];

export default function Contact() {
	return (
		<>
			<RegularHeader
				title="Contact"
				description="Let's connect and explore how we can work together. Whether you have a project in mind, want to discuss potential collaboration, or just want to say hello, I'd love to hear from you."
			/>

			<StaggeredAnimation className="grid justify-center px-4 mx-auto *:grid w-full grid-cols-1 gap-8  mb-32 pb-12 sm:mt-0 sm:grid-cols-2 lg:gap-16" staggerDelay={0.3} animationDuration={0.6}>
				{socials.map((s) => (
					<Card key={s.href}>
						<Link
							href={s.href}
							target="_blank"
							className="p-4 relative flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-24  lg:pb-16  md:p-16"
						>
							<span
								className="absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
								aria-hidden="true"
							/>
							<span className="relative z-10 flex items-center justify-center w-12 h-12 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-200 drop-shadow-orange">
								{s.icon}
							</span>{" "}
							<div className="z-10 flex flex-col items-center">
								<span className="lg:text-xl font-medium duration-150 xl:text-3xl text-zinc-200 group-hover:text-white font-display">
									{s.handle}
								</span>
								<span className="mt-4 text-sm text-center duration-1000 text-zinc-400 group-hover:text-zinc-200">
									{s.label}
								</span>
							</div>
						</Link>
					</Card>
				))}
			</StaggeredAnimation >
		</>
	);
}
