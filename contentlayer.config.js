import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const janigowskiWarpTheme = {
	name: 'custom-warp',
	type: 'dark',
	colors: {
		'editor.background': '#1C1C1C',
		'editor.foreground': '#F5F5F5',
		'activityBar.background': '#1C1C1C',
		'activityBar.foreground': '#F5F5F5',
		'editorLineNumber.foreground': '#595E44',
		'editor.lineHighlightBackground': '#4C445E20',
		'textLink.foreground': '#FFCC00',
		'focusBorder': '#D931DE',
		'textLink.activeForeground': '#BBDF32',
	},
	tokenColors: [
		{
			scope: ['comment', 'punctuation.definition.comment', 'string.comment'],
				settings: {
					foreground: '#595E44'
				}
		},
		{
			scope: ['constant', 'entity.name.constant', 'variable.other.constant', 'variable.other.enummember'],
				settings: {
					foreground: '#6831DE'
				}
		},
		{
			scope: ['entity.name.function', 'support.function'],
				settings: {
					foreground: '#FFCC00'
				}
		},
		{
			scope: ['keyword', 'storage.type', 'storage.modifier'],
				settings: {
					foreground: '#D931DE'
				}
		},
		{
			scope: ['string', 'string punctuation.section.embedded source'],
				settings: {
					foreground: '#BBDF32'
				}
		},
		{
			scope: ['variable', 'variable.parameter.function', 'variable.other'],
				settings: {
					foreground: '#F5F5F5'
				}
		},
		{
			scope: ['entity.name.type', 'entity.other.inherited-class'],
				settings: {
					foreground: '#5E445E'
				}
		},
		{
			scope: ['punctuation', 'meta.brace'],
				settings: {
					foreground: '#4C445E'
				}
		},
		{
			scope: ['meta.tag', 'meta.bracket'],
				settings: {
					foreground: '#6831DE'
				}
		}
	]
};

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
	path: {
		type: "string",
		resolve: (doc) => `/${doc._raw.flattenedPath}`,
	},
	slug: {
		type: "string",
		resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
	},
};

export const Project = defineDocumentType(() => ({
	name: "Project",
	filePathPattern: "./projects/**/*.mdx",
	contentType: "mdx",

	fields: {
		published: {
			type: "boolean",
		},
		title: {
			type: "string",
			required: true,
		},
		description: {
			type: "string",
			required: true,
		},
		date: {
			type: "date",
		},
		url: {
			type: "string",
		},
		repository: {
			type: "string",
		},
	},
	computedFields,
}));

export const Book = defineDocumentType(() => ({
	name: "Book",
	filePathPattern: "./library/**/*.mdx",
	contentType: "mdx",

	fields: {
		published: {
			type: "boolean",
			required: true,
		},
		title: {
			type: "string",
			required: true,
		},
		author: {
			type: "string",
			required: true,
		},
		status: {
			type: 'enum',
			options: ['read', 'reading', 'waiting', 'paused', 'listened', 'listening'],
			required: true,
		},
		bookType: {
			type: 'enum',
			options: ['paper', 'audiobook', 'ebook'],
			required: true,
		},
		tag: {
			type: "string",
			required: true,
		},
		date: {
			type: "date",
		},
		cover: {
			type: "string",
			required: true,
		},
	},
	computedFields,
}));

export const Post = defineDocumentType(() => ({
	name: "Post",
	filePathPattern: "./posts/**/*.mdx",
	contentType: "mdx",

	fields: {
		published: {
			type: "boolean",
		},
		title: {
			type: "string",
			required: true,
		},
		description: {
			type: "string",
			required: true,
		},
		date: {
			type: "date",
		},
	},
	computedFields,
}));

export const Resume = defineDocumentType(() => ({
	name: "Resume",
	filePathPattern: "./profile/resume.json",
	contentType: "json",

	fields: {
		name: { type: "string" },
		label: { type: "string" },
		email: { type: "string" },
		url: { type: "string" },
		summary: { type: "string" },
		locationCity: { type: "string" },
		locationCountryCode: { type: "string" },
		profiles: { type: "json" },
		work: { type: "json" },
		education: { type: "json" },
		skills: { type: "json" },
		interests: { type: "json" }
	}
}));

export const ResumeExtension = defineDocumentType(() => ({
	name: "ResumeExtension",
	filePathPattern: "./resumes/**/*.json",
	contentType: "json",

	fields: {
		summary: { type: "string", required: false }
	},

	computedFields: {
		...computedFields,
		mergedResume: {
			type: "json",
			resolve: async (extension) => {
				// Get base resume data directly from the file
				const baseResume = {
					name: "Dawid Janiga",
					label: "Software Engineer",
					email: "dawidjaniga@gmail.com",
					url: "https://janigowski.dev",
					locationCity: "Kraków",
					locationCountryCode: "PL",
					profiles: [
						{
							network: "GitHub",
							username: "janigowski",
							url: "https://github.com/janigowski"
						},
						{
							network: "LinkedIn",
							url: "https://linkedin.com/in/dawidjaniga"
						}
					],
					work: [
						{
							name: "ADPList",
							position: "Mentor",
							startDate: "2024-03",
							summary: "Mentored 36+ developers from 17 countries",
							highlights: [
								"TOP 1% MENTOR (4x Recognized)",
								"Provided 4500+ minutes of technical guidance",
								"Conducted 1:1 mentorship sessions focusing on React, TypeScript, and architecture"
							]
						},
						{
							name: "janigowski.dev",
							position: "Media Technology Explorer",
							startDate: "2022-08",
							summary: "Leading the development of EXØ_LAB, an innovative desktop application unifying tools for new media artists",
							highlights: [
								"Conceptualized and developed an integrated environment for real-time audio-visual performance",
								"Engineered real-time waveform visualization and multi-channel mixing with BPM sync"
							]
						},
						{
							name: "Netguru",
							position: "Software Architect Frontend",
							startDate: "2021",
							endDate: "2022",
							summary: "Identified architectural drivers, technical risks and business needs to deliver new set of features in time and budget",
							highlights: [
								"Reduced Map loading time by 80% (10s ↘ 2s)",
								"Optimized state management by removing over +1500 LOC"
							]
						}
					],
					education: [
						{
							institution: "Stefan Czarniecki High School",
							area: "Math-physics profile",
							location: "Człuchów, Poland"
						}
					],
					skills: [
						{
							name: "Technical",
							keywords: [
								"React",
								"Node.js",
								"TypeScript",
								"Software Architecture",
								"Leadership",
								"Team building"
							]
						},
						{
							name: "Applications",
							keywords: [
								"Web",
								"Mobile",
								"APIs",
								"CLI",
								"Editors",
								"Tools",
								"Design Systems"
							]
						}
					],
					interests: [
						{
							name: "Main",
							keywords: [
								"Software Architecture",
								"Product Development",
								"Rock climbing & bouldering",
								"History, Art & design"
							]
						},
						{
							name: "Other",
							keywords: [
								"Trendy AI: ChatGPT, DALL-E, Midjourney and Cursor",
								"UI/UX/graphic design, video edit, sound production"
							]
						}
					]
				};

				// Only override the summary from the extension
				return {
					...baseResume,
					summary: extension.summary || baseResume.summary
				};
			}
		}
	}
}));

export default makeSource({
	contentDirPath: "./content",
	documentTypes: [Resume, ResumeExtension, Project, Book, Post],
	mdx: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [
			rehypeSlug,
			[
				rehypePrettyCode,
				{
					theme: janigowskiWarpTheme,
					onVisitLine(node) {
						if (node.children.length === 0) {
							node.children = [{ type: "text", value: " " }];
						}
					},
					onVisitHighlightedLine(node) {
						node.properties.className.push("line--highlighted");
					},
					onVisitHighlightedWord(node) {
						node.properties.className = ["word--highlighted"];
					},
				},
			],
			[
				rehypeAutolinkHeadings,
				{
					properties: {
						className: ["subheading-anchor"],
						ariaLabel: "Link to section",
					},
				},
			],
		],
	},
});
