import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function GET() { const css = await readFile(join(process.cwd(), 'static/giscus-theme.css'), 'utf8'); return new Response(css, { headers: { 'Content-Type': 'text/css' } }); }
