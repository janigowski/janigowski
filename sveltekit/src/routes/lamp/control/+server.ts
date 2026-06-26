import { error, json } from '@sveltejs/kit';
import { setColor, turn } from '$server/hue';

export async function POST({ request }) { const { action, value } = await request.json(); if (action === 'turn' && (value === 'on' || value === 'off')) { await turn(value); return json({ ok: true }); } if (action === 'color' && typeof value === 'string') { await setColor(value); return json({ ok: true }); } error(400, 'Invalid lamp action'); }
