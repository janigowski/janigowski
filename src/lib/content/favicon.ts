import { showBookmarkImage } from './bookmarks';

export const FAVICON_MAX_PX = 64;
export const FAVICON_DISPLAY_PX = 32;

export type FaviconDisplay = {
	src: string;
	width: number;
	height: number;
	max: number;
};

type RawIcon = {
	href: string;
	sizes: number[];
	scalable: boolean;
};

type RankedIcon = {
	href: string;
	rank: number;
	rel: number;
	order: number;
};

export function bookmarkDomain(pageUrl: string) {
	try {
		const url = new URL(pageUrl);
		if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined;
		return url.host.toLowerCase();
	} catch {
		return undefined;
	}
}

export function fallbackFaviconUrl(pageUrl: string) {
	const domain = bookmarkDomain(pageUrl);
	if (!domain) return undefined;
	return `https://${domain}/favicon.ico`;
}

export function isHttpIconUrl(value: string) {
	try {
		const url = new URL(value);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
}

export function faviconForBookmark(pageUrl: string, resolved: Readonly<Record<string, string>>) {
	const domain = bookmarkDomain(pageUrl);
	if (!domain) return undefined;
	const chosen = resolved[domain];
	if (chosen && isHttpIconUrl(chosen)) return chosen;
	return fallbackFaviconUrl(pageUrl);
}

export function faviconDisplay(src: string | undefined, failedSrc?: string): FaviconDisplay | undefined {
	if (!src || !showBookmarkImage(src, failedSrc)) return undefined;
	const width = Math.min(FAVICON_DISPLAY_PX, FAVICON_MAX_PX);
	return { src, width, height: width, max: FAVICON_MAX_PX };
}

export function faviconFromDocument(html: string, pageUrl: string) {
	const scope = iconScope(html);
	const base = documentBase(scope, pageUrl);
	const ranked: RankedIcon[] = [];
	let order = 0;
	for (const body of extractTags(scope, 'link')) {
		const attrs = parseAttributes(body);
		const rel = iconRelRank(attrs.rel);
		if (rel === undefined) continue;
		const type = (attrs.type ?? '').toLowerCase();
		for (const icon of rawIcons(attrs, type)) {
			const href = resolveIconHref(icon.href, base);
			const rank = rankIcon(icon);
			if (!href || rank === undefined) continue;
			ranked.push({ href, rank, rel, order });
			order += 1;
		}
	}
	ranked.sort((a, b) => b.rank - a.rank || a.rel - b.rel || a.order - b.order);
	return ranked[0]?.href;
}

function iconScope(html: string) {
	const withoutComments = html.replace(/<!--[\s\S]*?-->/g, '');
	const head = /<head\b[^>]*>([\s\S]*?)<\/head>/i.exec(withoutComments);
	const scope = head ? head[1] : withoutComments;
	return scope.replace(/<script\b[\s\S]*?<\/script>/gi, '');
}

function documentBase(scope: string, pageUrl: string) {
	for (const body of extractTags(scope, 'base')) {
		const href = parseAttributes(body).href;
		if (!href) continue;
		try {
			return new URL(href, pageUrl).href;
		} catch {
			continue;
		}
	}
	return pageUrl;
}

function rawIcons(attrs: Record<string, string>, type: string): RawIcon[] {
	const sizes = parseSizes(attrs.sizes);
	const icons: RawIcon[] = [];
	if (attrs.href) icons.push({ href: attrs.href, sizes, scalable: isSvg(type, attrs.href) });
	for (const entry of parseSrcset(attrs.imagesrcset)) {
		icons.push({
			href: entry.href,
			sizes: entry.size ? [entry.size] : [],
			scalable: isSvg(type, entry.href)
		});
	}
	return icons;
}

function rankIcon(icon: RawIcon) {
	const within = icon.sizes.filter((size) => size > 0 && size <= FAVICON_MAX_PX);
	if (within.length) return Math.max(...within);
	if (icon.sizes.length) return icon.scalable ? FAVICON_MAX_PX : undefined;
	if (icon.scalable) return FAVICON_MAX_PX;
	return 0;
}

function iconRelRank(value: string | undefined) {
	const tokens = (value ?? '').toLowerCase().split(/\s+/).filter(Boolean);
	if (tokens.includes('icon')) return 0;
	if (tokens.includes('apple-touch-icon')) return 1;
	if (tokens.includes('apple-touch-icon-precomposed')) return 2;
	return undefined;
}

function parseSizes(value: string | undefined) {
	if (!value) return [];
	const sizes: number[] = [];
	for (const token of value.toLowerCase().split(/\s+/)) {
		const match = /^(\d+)x(\d+)$/.exec(token);
		if (!match) continue;
		const width = Number(match[1]);
		const height = Number(match[2]);
		if (width <= 0 || height <= 0) continue;
		sizes.push(Math.max(width, height));
	}
	return sizes;
}

function parseSrcset(value: string | undefined) {
	if (!value) return [];
	const entries: { href: string; size?: number }[] = [];
	for (const part of value.split(',')) {
		const tokens = part.trim().split(/\s+/).filter(Boolean);
		const href = tokens[0];
		if (!href) continue;
		const descriptor = tokens[1]?.toLowerCase();
		const width = descriptor && /^(\d+)w$/.exec(descriptor);
		const size = width ? Number(width[1]) : undefined;
		entries.push({ href, size: size && size > 0 ? size : undefined });
	}
	return entries;
}

function isSvg(type: string, href: string) {
	if (type.includes('svg')) return true;
	const path = href.trim().split(/[?#]/, 1)[0] ?? '';
	return path.toLowerCase().endsWith('.svg');
}

function resolveIconHref(href: string, base: string) {
	const trimmed = href.trim();
	if (!trimmed) return undefined;
	try {
		const url = new URL(trimmed, base);
		if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined;
		return url.href;
	} catch {
		return undefined;
	}
}

function extractTags(html: string, name: string) {
	const bodies: string[] = [];
	const start = new RegExp(`<${name}\\b`, 'gi');
	let match: RegExpExecArray | null;
	while ((match = start.exec(html))) {
		let index = match.index + match[0].length;
		let quote = '';
		for (; index < html.length; index += 1) {
			const char = html[index];
			if (quote) {
				if (char === quote) quote = '';
				continue;
			}
			if (char === '"' || char === "'") {
				quote = char;
				continue;
			}
			if (char === '>') break;
		}
		bodies.push(html.slice(match.index + match[0].length, index));
		start.lastIndex = index + 1;
	}
	return bodies;
}

function parseAttributes(source: string) {
	const attrs: Record<string, string> = {};
	const pattern = /([^\s"'=<>`]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
	let match: RegExpExecArray | null;
	while ((match = pattern.exec(source))) {
		const name = match[1].toLowerCase();
		if (name === '/') continue;
		attrs[name] = match[2] ?? match[3] ?? match[4] ?? '';
	}
	return attrs;
}
