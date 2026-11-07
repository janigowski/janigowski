import { writeFileSync } from 'node:fs';
import { Redis } from '@upstash/redis';
import { UpstashEventStore } from '../src/lib/events/store.ts';

const snapshotPath = new URL('../src/lib/events/snapshot.json', import.meta.url);

async function snapshot() {
	const url = process.env.UPSTASH_REDIS_REST_URL;
	const token = process.env.UPSTASH_REDIS_REST_TOKEN;
	if (!url || !token) {
		console.log('Click snapshot skipped: Upstash is not configured. Existing counts stay in place.');
		return;
	}
	try {
		const redis = new Redis({ url, token, enableTelemetry: false });
		const counts = await new UpstashEventStore(redis).counts('bookmark_click');
		writeFileSync(snapshotPath, `${JSON.stringify(counts, null, '\t')}\n`);
		console.log(`Click snapshot wrote ${Object.keys(counts).length} bookmark counts.`);
	} catch (error) {
		console.warn('Click snapshot failed. The previous snapshot will be published.');
		console.warn(error instanceof Error ? error.message : error);
	}
}

await snapshot();
