import { Book } from "contentlayer/generated";

/**
 * Sorts books by date (newest first) with proper handling for books without dates
 */
export function sortBooks(books: Book[]) {
    return books
        .filter((b) => b.published)
        .sort((a, b) => {
            // If both books have dates, sort by date (newest first)
            if (a.date && b.date) {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            }
            // If only one book has a date, the one with date comes first
            if (a.date) return -1;
            if (b.date) return 1;
            // If neither has a date, sort by title
            return a.title.localeCompare(b.title);
        });
}

/**
 * Returns the latest books, filtered and sorted
 */
export function getLatestBooks(books: Book[], limit: number = 10) {
    return sortBooks(books).slice(0, limit);
} 