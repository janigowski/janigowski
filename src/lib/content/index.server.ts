import matter from 'gray-matter';
import { marked } from 'marked';
import mergeWith from 'lodash/mergeWith';
import baseResume from '../../../resume.json';
import type { Book, ContentBase, ContentKind, Post, Project, Resume, ResumeInput, ResumeVariant } from './types';

marked.setOptions({ gfm: true, breaks: false });

type ContentModule<T> = { metadata: T };
type ContentMetadata = Record<string, unknown>;
type ResumeModule = { default: ResumeInput };

const postMetadata = import.meta.glob<ContentModule<Partial<Post>>>('../../../content/posts/**/*.mdx', { eager: true });
const projectMetadata = import.meta.glob<ContentModule<Partial<Project>>>('../../../content/projects/**/*.mdx', { eager: true });
const bookMetadata = import.meta.glob<ContentModule<Partial<Book>>>('../../../content/library/**/*.mdx', { eager: true });
const postRaw = import.meta.glob<string>('../../../content/posts/**/*.mdx', { eager: true, query: '?raw', import: 'default' });
const projectRaw = import.meta.glob<string>('../../../content/projects/**/*.mdx', { eager: true, query: '?raw', import: 'default' });
const bookRaw = import.meta.glob<string>('../../../content/library/**/*.mdx', { eager: true, query: '?raw', import: 'default' });
const resumeVariants = import.meta.glob<ResumeModule>('../../../content/resumes/**/*.json', { eager: true });

function flattenedPath(file: string) {
	return file.split('/content/')[1].replace(/\.(mdx|md|json)$/, '');
}

function slugFor(file: string) {
	return flattenedPath(file).split('/').slice(1).join('/');
}

async function readCollection<T extends ContentBase>(
	metadataModules: Record<string, ContentModule<ContentMetadata>>,
	rawModules: Record<string, string>,
	kind: ContentKind
): Promise<T[]> {
	return Promise.all(
		Object.entries(metadataModules).map(async ([file, module]) => {
			const parsed = matter(rawModules[file] ?? '');
			const body = parsed.content.trim();
			return {
				...module.metadata,
				...parsed.data,
				slug: slugFor(file),
				path: `/${flattenedPath(file)}`,
				body,
				html: await marked.parse(body),
				kind
			} as T;
		})
	);
}

export async function getPosts() { return sortByDate(await readCollection<Post>(postMetadata, postRaw, 'post')); }
export async function getProjects() { return sortByDate(await readCollection<Project>(projectMetadata, projectRaw, 'project')); }
export async function getBooks() { return sortBooks(await readCollection<Book>(bookMetadata, bookRaw, 'book')); }
export async function getPost(slug: string) { return (await getPosts()).find((post) => post.slug === slug); }
export async function getProject(slug: string) { return (await getProjects()).find((project) => project.slug === slug); }
export async function getBook(slug: string) { return (await getBooks()).find((book) => book.slug === slug); }
export function sortByDate<T extends { published?: boolean; date?: string; title: string }>(items: T[]) { return items.filter((item) => item.published).sort((a, b) => { if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime(); if (a.date) return -1; if (b.date) return 1; return a.title.localeCompare(b.title); }); }
export function sortBooks(books: Book[]) { return sortByDate(books); }
export function getLatestPosts(posts: Post[], limit = 3) { return sortByDate(posts).slice(0, limit); }
export function getLatestBooks(books: Book[], limit = 10) { return sortBooks(books).slice(0, limit); }
export function getRandomProjects(projects: Project[], limit = 3) { return projects.filter((project) => project.published).sort(() => Math.random() - 0.5).slice(0, limit); }
export function getLibraryStats(books: Book[]) { const publishedBooks = books.filter((book) => book.published); const readBooks = publishedBooks.filter((book) => book.status === 'read' || book.status === 'listened'); const readingBooks = publishedBooks.filter((book) => book.status === 'reading' || book.status === 'listening'); const waitingBooks = publishedBooks.filter((book) => book.status === 'waiting' || book.status === 'paused'); const counts = readBooks.reduce<Record<string, number>>((acc, book) => ({ ...acc, [book.tag]: (acc[book.tag] || 0) + 1 }), {}); const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]; return { total: publishedBooks.length, read: readBooks.length, reading: readingBooks.length, waiting: waitingBooks.length, mostReadCategory: top ? `${top[0]} (${top[1]})` : 'None', completionRate: publishedBooks.length ? Math.round((readBooks.length / publishedBooks.length) * 100) : 0 }; }
export async function getBaseResume(): Promise<Resume> { return structuredClone(baseResume); }
export async function getResumes(): Promise<ResumeVariant[]> { const base = await getBaseResume(); const variants = Object.entries(resumeVariants).map(([file, module]) => { const variant = module.default; const slug = variant.slug ?? slugFor(file); const resolvedResume = mergeWith({}, base, variant, (objValue, srcValue) => { if (srcValue === undefined || srcValue === null) return objValue; if (Array.isArray(srcValue)) return srcValue; return undefined; }); return { slug, resolvedResume }; }); return variants.sort((a, b) => a.slug.localeCompare(b.slug)); }
export async function getResume(slug: string) { return (await getResumes()).find((resume) => resume.slug === slug); }
