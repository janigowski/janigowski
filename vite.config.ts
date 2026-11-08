import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { bookmarkFaviconPlugin } from './src/lib/vite/bookmark-favicons';

export default defineConfig({ plugins: [bookmarkFaviconPlugin(), tailwindcss(), sveltekit()] });
