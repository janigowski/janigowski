import { redirect } from '@sveltejs/kit';
import { buildHueLoginUrl } from '$server/hue';

export function GET() { redirect(302, buildHueLoginUrl()); }
