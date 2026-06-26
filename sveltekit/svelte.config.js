import adapter from '@sveltejs/adapter-auto';
import { mdsvex } from 'mdsvex';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const config = {
	extensions: ['.svelte', '.svx', '.md', '.mdx'],
	preprocess: [mdsvex({ extensions: ['.svx', '.md', '.mdx'], remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { properties: { className: ['subheading-anchor'], ariaLabel: 'Link to section' } }]] })],
	kit: { adapter: adapter(), alias: { $components: 'src/lib/components', $content: 'src/lib/content', $server: 'src/lib/server' } },
	compilerOptions: { runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true }
};

export default config;
