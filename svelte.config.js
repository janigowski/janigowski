import adapterAuto from '@sveltejs/adapter-auto';
import adapterCloudflare from '@sveltejs/adapter-cloudflare';
import { mdsvex } from 'mdsvex';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const adapter = process.env.WORKERS_CI || process.env.CF_PAGES ? adapterCloudflare() : adapterAuto();

const config = {
	extensions: ['.svelte', '.svx', '.md', '.mdx'],
	preprocess: [mdsvex({ extensions: ['.svx', '.md', '.mdx'], remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { properties: { className: ['subheading-anchor'], ariaLabel: 'Link to section' } }]] })],
	kit: { adapter, alias: { $components: 'src/lib/components', $content: 'src/lib/content', $server: 'src/lib/server' } },
	compilerOptions: { runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true }
};

export default config;
