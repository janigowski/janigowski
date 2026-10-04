import { env } from '$env/dynamic/private';
import { Redis } from '@upstash/redis';

export type TurnValue = 'on' | 'off';

function getRedirectUri() {
	const hosts = {
		production: env.URL || env.ORIGIN,
		'deploy-preview': env.DEPLOY_PRIME_URL,
		'branch-deploy': env.DEPLOY_PRIME_URL,
		development: env.HOST
	};
	const context = env.CONTEXT || 'development';
	const url =
		hosts[context as keyof typeof hosts] || env.HOST || env.URL || env.ORIGIN || env.DEPLOY_PRIME_URL;
	if (!url) throw new Error('Missing host configuration');
	return url.replace(/\/$/, '') + '/api/hue-authorize';
}

function getRedis() {
	if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) return undefined;
	return new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN });
}

async function getToken() {
	const redis = getRedis();
	return (redis ? await redis.get<string>('hue:access_token') : env.HUE_ACCESS_TOKEN) ?? undefined;
}

async function setTokens(accessToken: string, refreshToken: string, expiresIn: number) {
	const redis = getRedis();
	if (redis) {
		await redis.set('hue:access_token', accessToken);
		await redis.set('hue:refresh_token', refreshToken);
		await redis.set('hue:expires_at', Date.now() + expiresIn * 1000);
	}
}

function hexToRgb(hex: string) {
	const value = parseInt(hex.replace('#', ''), 16);
	return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

async function hueRequest(body: Record<string, unknown>) {
	const token = await getToken();
	const lightId = env.HUE_LIGHT_ID;
	if (!token || !lightId) throw new Error('Hue is not configured');
	const response = await fetch(`https://api.meethue.com/route/clip/v2/resource/light/${lightId}`, {
		method: 'PUT',
		headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	if (!response.ok) throw new Error(await response.text());
}

export function buildHueLoginUrl() {
	const clientId = env.HUE_CLIENT_ID;
	if (!clientId) throw new Error('Missing HUE_CLIENT_ID');
	return `https://api.meethue.com/v2/oauth2/authorize?client_id=${clientId}&response_type=code&state=${Math.random().toString(36).slice(2)}&redirect_uri=${encodeURIComponent(getRedirectUri())}`;
}

export async function exchangeCodeForToken(code: string) {
	const clientId = env.HUE_CLIENT_ID;
	const clientSecret = env.HUE_CLIENT_SECRET;
	if (!clientId || !clientSecret) throw new Error('Missing HUE_CLIENT_ID or HUE_CLIENT_SECRET');
	const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
	const response = await fetch('https://api.meethue.com/v2/oauth2/token', {
		method: 'POST',
		headers: {
			Authorization: `Basic ${credentials}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			code,
			redirect_uri: getRedirectUri()
		})
	});
	if (!response.ok) throw new Error(await response.text());
	const token = await response.json();
	await setTokens(token.access_token, token.refresh_token, token.expires_in);
	return token;
}

export async function turn(value: TurnValue) {
	await hueRequest({ on: { on: value === 'on' } });
}

export async function setColor(hex: string) {
	const { r, g, b } = hexToRgb(hex);
	await hueRequest({
		color: { xy: { x: r / 255, y: g / 255 } },
		dimming: { brightness: (Math.max(r, g, b) / 255) * 100 }
	});
}
