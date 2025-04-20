import { Post } from "contentlayer/generated";

/**
 * Sorts posts by date (newest first) with proper handling for posts without dates
 */
export function sortPosts(posts: Post[]) {
    return posts
        .filter((p) => p.published)
        .sort((a, b) => {
            // If both posts have dates, sort by date (newest first)
            if (a.date && b.date) {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            }
            // If only one post has a date, the one with date comes first
            if (a.date) return -1;
            if (b.date) return 1;
            // If neither has a date, sort by title
            return a.title.localeCompare(b.title);
        });
}

/**
 * Returns the latest posts, filtered and sorted
 */
export function getLatestPosts(posts: Post[], limit: number = 3) {
    return sortPosts(posts).slice(0, limit);
} 