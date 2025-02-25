"use client";

import Script from "next/script";

export function CloudFlareAnalytics() {
	if (process.env.NODE_ENV !== "production") {
		return null;
	}

	return (
		<Script
			defer
			src="https://static.cloudflareinsights.com/beacon.min.js"
			data-cf-beacon='{"token": "01787df6fe4a40d5a38450a6033222b3"}'
		/>
	);
}
