import path from 'node:path';
import type { Plugin } from 'vite';
import { bookmarkPageUrls, collectFavicons } from '../server/favicons';

const virtualId = 'virtual:bookmark-favicons';
const resolvedId = `\0${virtualId}`;

export function bookmarkFaviconPlugin(): Plugin {
	let root = process.cwd();
	let map: Record<string, string> = {};
	let pending: Promise<void> | undefined;
	let task = Promise.resolve();

	const refresh = () => {
		task = task
			.catch(() => undefined)
			.then(async () => {
				try {
					const urls = await bookmarkPageUrls(path.join(root, 'content/bookmarks'));
					map = await collectFavicons(urls, {
						onError(domain, error) {
							const message = error instanceof Error ? error.message : String(error);
							console.warn(`[bookmark-favicons] ${domain}: ${message}`);
						}
					});
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error);
					console.warn(`[bookmark-favicons] ${message}`);
					map = {};
				}
			});
		pending = task;
		return task;
	};

	return {
		name: 'bookmark-favicons',
		enforce: 'pre',
		configResolved(config) {
			root = config.root;
		},
		buildStart() {
			return refresh();
		},
		configureServer(server) {
			const watch = (file: string) => {
				const parts = file.split(path.sep);
				const content = parts.lastIndexOf('content');
				if (content < 0 || parts[content + 1] !== 'bookmarks') return;
				refresh().then(() => {
					const mod = server.moduleGraph.getModuleById(resolvedId);
					if (mod) server.moduleGraph.invalidateModule(mod);
					server.ws.send({ type: 'full-reload' });
				});
			};
			server.watcher.on('add', watch);
			server.watcher.on('change', watch);
			server.watcher.on('unlink', watch);
		},
		resolveId(id) {
			if (id === virtualId) return resolvedId;
		},
		async load(id) {
			if (id !== resolvedId) return;
			if (pending) await pending;
			else await refresh();
			return `export default ${JSON.stringify(map)}`;
		}
	};
}
