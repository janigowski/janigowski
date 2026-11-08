import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import { compile } from 'svelte/compiler';
import { render } from 'svelte/server';
import { faviconDisplay, faviconForBookmark } from '../src/lib/content/favicon.ts';
import { bookmarkPageUrls, collectFavicons, type FaviconFetch } from '../src/lib/server/favicons.ts';

const fixtures = new URL('./fixtures/favicons/', import.meta.url);
const pages = new Map(
	readdirSync(new URL('pages/', fixtures))
		.filter((name) => name.endsWith('.html'))
		.map((name) => [name.replace(/\.html$/, ''), readFileSync(new URL(`pages/${name}`, fixtures), 'utf8')])
);

const blocked = ['google.com/s2', 'icons.duckduckgo.com', 'favicon.yandex', 'gstatic.com'];

async function test(name: string, fn: () => Promise<void>) {
	try {
		await fn();
		console.log(`ok ${name}`);
	} catch (error) {
		console.error(`fail ${name}`);
		throw error;
	}
}

function pageFetch(calls: string[], timeoutMs = 50): FaviconFetch {
	return async (input, init) => {
		calls.push(input);
		assert.equal(
			blocked.some((host) => input.includes(host)),
			false
		);
		const host = new URL(input).host;
		if (host === 'slow.example') {
			await new Promise((_, reject) => {
				const signal = init?.signal;
				const timer = setTimeout(() => reject(new Error('timeout did not abort')), 1000);
				if (!signal) {
					clearTimeout(timer);
					reject(new Error('missing abort signal'));
					return;
				}
				const abort = () => {
					clearTimeout(timer);
					reject(signal.reason ?? new Error('aborted'));
				};
				if (signal.aborted) abort();
				else signal.addEventListener('abort', abort, { once: true });
			});
		}
		if (host === 'down.example') return new Response('down', { status: 503 });
		if (host === 'binary.example') return new Response('not html', { status: 200, headers: { 'content-type': 'image/png' } });
		const html = pages.get(host);
		if (!html) return new Response('missing', { status: 404 });
		return new Response(html, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } });
	};
}

await test('resolves fixture pages once per domain into a favicon address for display', async () => {
	const calls: string[] = [];
	const urls = await bookmarkPageUrls(new URL('bookmarks/', fixtures).pathname);
	const map = await collectFavicons(urls, { fetch: pageFetch(calls), timeoutMs: 50 });
	const favicon = (url: string) => faviconForBookmark(url, map);
	const shown = (url: string) => faviconDisplay(favicon(url));

	assert.deepEqual(calls.filter((url) => url.startsWith('https://example.com/')).sort(), [
		'https://example.com/posts/alpha'
	]);
	assert.equal(calls.includes('https://example.com/posts/beta'), false);
	assert.equal(calls.filter((url) => new URL(url).host === 'www.example.com').length, 1);
	assert.equal(calls.some((url) => url.endsWith('.png') || url.endsWith('.svg') || url.endsWith('.ico')), false);

	const alpha = shown('https://example.com/posts/alpha');
	const beta = shown('https://example.com/posts/beta');
	assert.ok(alpha);
	assert.equal(alpha.src, 'https://cdn.example.com/fav-48.png');
	assert.equal(beta?.src, alpha.src);
	assert.equal(alpha.max, 64);
	assert.ok(alpha.width <= alpha.max);
	assert.equal(alpha.height, alpha.width);
	assert.equal(shown('https://www.example.com/home')?.src, 'https://www.example.com/www.png');
	assert.equal(shown('https://videos.example/watch?v=1')?.src, 'https://videos.example/favicon.svg');
	assert.equal(shown('https://srcset.example/a')?.src, 'https://srcset.example/f-64.png');
	assert.equal(shown('https://multi.example/a')?.src, 'https://multi.example/icons/favicon.ico');
	assert.equal(blocked.some((host) => alpha.src.includes(host)), false);

	const { body } = await renderFavicon({ src: alpha.src });
	assert.equal(body.includes(alpha.src), true);
	assert.equal(body.includes(`width="${alpha.width}"`), true);
	assert.equal(body.includes(`height="${alpha.height}"`), true);
	assert.equal(body.includes(`max-width: ${alpha.max}px`), true);
	assert.equal(body.includes(`max-height: ${alpha.max}px`), true);
	assert.equal((await renderFavicon({ src: undefined })).body.includes('<img'), false);
});

await test('falls back when resolution fails and hides a favicon the browser cannot load', async () => {
	const calls: string[] = [];
	const urls = await bookmarkPageUrls(new URL('bookmarks/', fixtures).pathname);
	const map = await collectFavicons(urls, { fetch: pageFetch(calls), timeoutMs: 50 });
	const shown = (url: string) => faviconDisplay(faviconForBookmark(url, map));

	assert.equal(shown('https://plain.example/notes')?.src, 'https://plain.example/favicon.ico');
	assert.equal(shown('https://big.example/only')?.src, 'https://big.example/favicon.ico');
	assert.equal(shown('https://down.example/item')?.src, 'https://down.example/favicon.ico');
	assert.equal(shown('https://slow.example/item')?.src, 'https://slow.example/favicon.ico');
	assert.equal(shown('https://binary.example/file')?.src, 'https://binary.example/favicon.ico');
	assert.equal(faviconForBookmark('notaurl', map), undefined);
	assert.equal(faviconDisplay(undefined), undefined);

	const broken = 'https://down.example/favicon.ico';
	assert.equal(faviconDisplay(broken, broken), undefined);
	assert.equal(faviconDisplay(shown('https://plain.example/notes')?.src, broken)?.src, 'https://plain.example/favicon.ico');
});

async function renderFavicon(props: { src?: string }) {
	const source = readFileSync(new URL('../src/lib/components/BookmarkFavicon.svelte', import.meta.url), 'utf8');
	const compiled = compile(source, {
		filename: 'BookmarkFavicon.svelte',
		generate: 'server',
		css: 'external',
		runes: true
	});
	const rewritten = compiled.js.code.replaceAll(
		'$content/favicon',
		new URL('../src/lib/content/favicon.ts', import.meta.url).href
	);
	const dir = mkdtempSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '.tmp-favicon-'));
	const file = path.join(dir, 'BookmarkFavicon.ssr.js');
	writeFileSync(file, rewritten);
	try {
		const component = (await import(pathToFileURL(file).href)).default;
		return await render(component, { props });
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
}
