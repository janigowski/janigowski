import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import lodash from 'lodash'
import baseResume from './resume.json'

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
	filePathPattern: "./resumes/**/*.json",
	contentType: "json",

	fields: {
		slug: { type: "string", required: true },
		name: { type: "string" },
		role: { type: "string" },
		email: { type: "string" },
		url: { type: "string" },
		summary: { type: "string" },
		locationCity: { type: "string" },
		locationCountryCode: { type: "string" },
		profiles: { 
			type: "json",
			description: "List of social media profiles"
		},
		highlights: {
			type: "json",
			description: "Technical skills and key numbers"
		},
		clifton_strengths: { type: "json" },
		work: {
			type: "json",
			description: "List of work experiences"
		},
		education: {
			type: "json",
			description: "List of education entries"
		},
		skills: {
			type: "json",
			description: "List of skill groups"
		},
		interests: {
			type: "json",
			description: "List of interest groups"
		},
		talks: {
			type: "json",
			description: "List of conference talks and presentations"
		},
		hackathons: {
			type: "json",
			description: "List of hackathon participations"
		}
	},

	computedFields: {
		...computedFields,
		resolvedResume: {
			type: "json",
			resolve: (doc) => {
				const { _id, _raw, type, slug, ...cleanVariant } = doc
				return lodash.merge({}, baseResume, cleanVariant)
			}
		}
	}
}));

export default makeSource({
	contentDirPath: "./content",
	documentTypes: [Resume, Project, Book, Post],
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
