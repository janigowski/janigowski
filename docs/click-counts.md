# Bookmark click counts

Public bookmark pages show aggregate click counts captured at build time. A click is recorded when someone opens a bookmark through its title, displayed URL, or detail-page link. Each of those is one click. The count is not a count of people.

The browser posts `{ "name": "bookmark_click", "entity": "<slug>" }` to `POST /api/events`. The server checks that the request is same-origin, small, and names a published bookmark, then increments one Redis hash field. It does not store visitor ids, cookies, IP addresses, or the destination URL. The page does not wait on the request before opening the link.

Counts on the site come from `src/lib/events/snapshot.json`, which `bun run build` refreshes before Vite runs. They change only when the site is built again.

## Configuration

Use the existing Upstash Redis REST credentials, the same names already read by the lamp integration. Set them for the Netlify build and for the site's functions:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

No Redis URL or token is sent to the browser. If either value is missing, or Upstash cannot be reached, the click endpoint responds successfully and drops the event. Navigation still proceeds. A failed or skipped snapshot keeps the snapshot file already in the build, so a bad read does not reset published counts to zero.

`bun run snapshot-clicks` refreshes the snapshot without building.

## Daily refresh

GitHub Actions runs `.github/workflows/refresh-click-counts.yml` at 05:00 UTC every day. That is 06:00 in Europe/Warsaw during standard time and 07:00 during daylight saving time. GitHub schedules are UTC and do not follow the Warsaw clock change.

The workflow sends a POST to the `NETLIFY_BUILD_HOOK` repository secret. Create that hook in the Netlify site's build settings and store only the hook URL as the secret. The workflow does not deploy by itself. Netlify builds `main`, the build reads the Redis hash once, and the new pages replace the previous counts.

Until `NETLIFY_BUILD_HOOK` is set, the scheduled run logs that it is skipping and leaves the site unchanged. A content push to `main` also rebuilds and refreshes the snapshot when the Upstash variables are present. If the snapshot read fails, the build continues and publishes the previous snapshot.
