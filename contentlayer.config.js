import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import lodash from 'lodash'
import baseResume from './resume.json' assert { type: 'json' };

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

const Profile = {
	network: { type: "string", required: true },
	username: { type: "string" },
	url: { type: "string", required: true }
};

const Leadership = {
	meetings_hosted: { type: "string", required: true },
	description: { type: "string", required: true },
	topics: { type: "json", required: true }
};

const Teaching = {
	course_length: { type: "string", required: true },
	students: { type: "number", required: true },
	topic: { type: "string", required: true },
	project: { type: "string", required: true }
};

const ProductDesign = {
	sprints: { type: "number", required: true },
	description: { type: "string", required: true }
};

const Work = {
	name: { type: "string", required: true },
	position: { type: "string", required: true },
	startDate: { type: "string", required: true },
	endDate: { type: "string" },
	summary: { type: "string" },
	highlights: { type: "json" },
	skills: { type: "json" },
	product_engineering: { type: "json" },
	company_wide: { type: "json" },
	leadership: { type: "json" },
	teaching: { type: "json" },
	product_design: { type: "json" },
	projects: { type: "json" },
	other_achievements: { type: "json" },
	projectsStyles: { type: "json" }
};

const Education = {
	institution: { type: "string", required: true },
	area: { type: "string", required: true },
	location: { type: "string", required: true }
};

const Talk = {
	date: { type: "string", required: true },
	conference: { type: "string", required: true },
	place: { type: "string", required: true },
	title: { type: "string", required: true }
};

const Hackathon = {
	name: { type: "string", required: true },
	achievement: { type: "string" }
};

export const Resume = defineDocumentType(() => ({
	name: "Resume",
	filePathPattern: "./resumes/**/*.json",
	contentType: "json",

	fields: {
		slug: { type: "string", required: true },
		name: { type: "string" },
		role: { type: "string" },
		experience_years: { type: "string" },
		products_contributed: { type: "string" },
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
			description: "Technical skills and numbers"
		},
		clifton_strengths: { 
			type: "json",
			description: "List of Clifton Strengths assessment results"
		},
		mentoring: {
			type: "json",
			description: "Current mentoring position with highlights and skills"
		},
		work: {
			type: "json",
			description: "List of work experiences with structure: { name, position, startDate, endDate?, summary?, highlights?, skills?, product_engineering?, company_wide?, leadership?, teaching?, product_design?, projects?, other_achievements? }"
		},
		education: {
			type: "json",
			description: "List of education entries with structure: { institution, area, location }"
		},
		interests: {
			type: "json",
			description: "List of interest groups with structure: { name, keywords }"
		},
		talks: {
			type: "json",
			description: "List of talks with structure: { date, conference, place, title }"
		},
		hackathons: {
			type: "json",
			description: "List of hackathon entries with structure: { name, achievement? }"
		}
	},

	computedFields: {
		...computedFields,
		resolvedResume: {
			type: "json",
			resolve: (doc) => {
				const { _id, _raw, type, resolvedResume, ...cleanVariant } = doc
				
				const base = JSON.parse(JSON.stringify(baseResume))
				
				const customizer = (objValue, srcValue) => {
					if (srcValue === undefined || srcValue === null) {
						return objValue
					}
					if (Array.isArray(srcValue)) {
						return srcValue
					}
				}
				
				const result = lodash.mergeWith({}, base, cleanVariant, customizer)
				
				return result
			}
		}
	}
}));

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
