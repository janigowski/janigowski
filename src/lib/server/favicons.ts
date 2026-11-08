import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { bookmarkDomain, fallbackFaviconUrl, faviconFromDocument } from '../content/favicon';

export const FAVICON_FETCH_TIMEOUT_MS = 5000;
const HEAD_BYTES = 256 * 1024;

export type FaviconFetch = (
	input: string,
	init?: { signal?: AbortSignal; headers?: Record<string, string>; redirect?: 'follow' }
) => Promise<Response>;

export type FaviconResolveOptions = {
	fetch?: FaviconFetch;
	timeoutMs?: number;
	onError?: (domain: string, error: unknown) => void;
};

export async function bookmarkPageUrls(bookmarksDir: string) {
	let names: string[];
	try {
		names = await readdir(bookmarksDir);
	} catch {
		return [];
	}
	const urls: string[] = [];
	for (const name of names.sort()) {
		if (!name.endsWith('.mdx') && !name.endsWith('.md')) continue;
		try {
			const raw = await readFile(path.join(bookmarksDir, name), 'utf8');
			const url = matter(raw).data?.url;
			if (typeof url === 'string' && url.trim()) urls.push(url.trim());
		} catch {
			continue;
		}
	}
	return urls;
}

export async function collectFavicons(pageUrls: string[], options?: FaviconResolveOptions) {
	const first = new Map<string, string>();
	for (const pageUrl of pageUrls) {
		const domain = bookmarkDomain(pageUrl);
		if (!domain || first.has(domain)) continue;
		first.set(domain, pageUrl);
	}
	const resolved = await Promise.all(
		[...first].map(async ([domain, pageUrl]) => {
			const icon = await resolveDomainFavicon(pageUrl, options);
			return [domain, icon] as const;
		})
	);
	const map: Record<string, string> = {};
	for (const [domain, icon] of resolved) {
		if (icon) map[domain] = icon;
	}
	return map;
}

export async function resolveDomainFavicon(pageUrl: string, options?: FaviconResolveOptions) {
	const fallback = fallbackFaviconUrl(pageUrl);
	if (!fallback) return undefined;
	const domain = bookmarkDomain(pageUrl) ?? pageUrl;
	const fetchImpl = options?.fetch ?? fetch;
	const timeoutMs = options?.timeoutMs ?? FAVICON_FETCH_TIMEOUT_MS;
	try {
		const response = await fetchImpl(pageUrl, {
			signal: AbortSignal.timeout(timeoutMs),
			redirect: 'follow',
			headers: {
				accept: 'text/html,application/xhtml+xml',
				'user-agent': 'Mozilla/5.0 (compatible; janigowski-bookmarks/1.0; +https://janigowski.dev/bookmarks)'
			}
		});
		if (!response.ok) {
			options?.onError?.(domain, new Error(`HTTP ${response.status}`));
			return fallback;
		}
		const contentType = response.headers.get('content-type') ?? '';
		if (contentType && !/html|xml/i.test(contentType)) return fallback;
		const html = await readHead(response);
		return faviconFromDocument(html, response.url || pageUrl) ?? fallback;
	} catch (error) {
		options?.onError?.(domain, error);
		return fallback;
	}
}

async function readHead(response: Response) {
	const reader = response.body?.getReader();
	if (!reader) return response.text();
	const decoder = new TextDecoder();
	let html = '';
	let received = 0;
	try {
		while (received < HEAD_BYTES) {
			const { done, value } = await reader.read();
			if (done) break;
			received += value.byteLength;
			html += decoder.decode(value, { stream: true });
			if (/<\/head>/i.test(html)) break;
		}
		html += decoder.decode();
		return html;
	} finally {
		await reader.cancel().catch(() => undefined);
	}
}
