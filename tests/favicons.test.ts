import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { compile } from 'svelte/compiler';
import { render } from 'svelte/server';

const source = readFileSync(new URL('../src/lib/components/BookmarkFavicon.svelte', import.meta.url), 'utf8');
const compiled = compile(source, {
	filename: 'BookmarkFavicon.svelte',
	generate: 'server',
	css: 'external',
	runes: true
});
const dir = mkdtempSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '.tmp-favicon-'));
const file = path.join(dir, 'BookmarkFavicon.ssr.js');
writeFileSync(file, compiled.js.code);

try {
	const component = (await import(pathToFileURL(file).href)).default;
	const { body } = await render(component, {
		props: { url: 'https://martinfowler.com/articles/modularizing-react-apps.html' }
	});
	assert.equal(body.includes('src="https://favicone.com/martinfowler.com?s=64"'), true);
	assert.equal(body.includes('width="32"'), true);
	assert.equal(body.includes('height="32"'), true);
	console.log('ok bookmark renders the favicone url');
} catch (error) {
	console.error('fail bookmark renders the favicone url');
	throw error;
} finally {
	rmSync(dir, { recursive: true, force: true });
}
