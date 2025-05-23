import Link from "next/link";
import React from "react";
import { allBooks } from "contentlayer/generated";
import { Card } from "../components/card";
import Article from "./article";
import { BookFilters } from "./filters";
import { Metadata } from "next";
import { RegularHeader } from "../components/regular-header";
import { LibraryStats } from "../components/library-stats";
import StaggeredAnimation from "../components/StaggeredAnimation";
import { sortBooks } from "../utils/books";

export const metadata: Metadata = {
  title: "Library"
};

export const revalidate = 60;

function getStatistics(books: typeof allBooks) {
  const publishedBooks = books.filter(b => b.published);
  const readBooks = publishedBooks.filter(b => b.status === 'read' || b.status === 'listened');
  const readingBooks = publishedBooks.filter(b => b.status === 'reading' || b.status === 'listening');
  const waitingBooks = publishedBooks.filter(b => b.status === 'waiting' || b.status === 'paused');

  // Count completed books by tag
  const completedBooksByTag: Record<string, number> = {};
  for (const book of readBooks) {
    completedBooksByTag[book.tag] = (completedBooksByTag[book.tag] || 0) + 1;
  }

  // Find tag with most completed books
  let maxCount = 0;
  let mostReadTag = '';

  for (const [tag, count] of Object.entries(completedBooksByTag)) {
    if (count > maxCount) {
      maxCount = count;
      mostReadTag = tag;
    }
  }

  return {
    total: publishedBooks.length,
    read: readBooks.length,
    reading: readingBooks.length,
    waiting: waitingBooks.length,
    mostReadCategory: maxCount > 0 ? `${mostReadTag} (${maxCount})` : 'None',
    completionRate: Math.round((readBooks.length / publishedBooks.length) * 100)
  };
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const selectedType = searchParams.type as string | undefined;
  const selectedTag = searchParams.tag as string | undefined;

  const books = sortBooks(allBooks);
  const types = Array.from(new Set(books.map((book) => book.bookType)))
    .sort((a, b) => {
      const countA = books.filter(book => book.bookType === a).length;
      const countB = books.filter(book => book.bookType === b).length;
      return countB - countA;
    });
  const tags = Array.from(new Set(books.map((book) => book.tag)))
    .sort((a, b) => {
      const countA = books.filter(book => book.tag === a).length;
      const countB = books.filter(book => book.tag === b).length;
      return countB - countA;
    });
  const stats = getStatistics(allBooks);

  const filteredBooks = books.filter((book) => {
    if (selectedType && book.bookType !== selectedType) return false;
    if (selectedTag && book.tag !== selectedTag) return false;
    return true;
  });

  return (
    <>
      <RegularHeader
        title="Library"
        description="A curated collection of books that have shaped my perspective"
      />

      <StaggeredAnimation staggerDelay={0.3} animationDuration={0.6}>
        <LibraryStats stats={stats} />

        {/* Filters */}
        <div className="mb-24">
          <BookFilters
            types={types}
            tags={tags}
            selectedType={selectedType}
            selectedTag={selectedTag}
          />
        </div>

        {/* Books Grid */}
        <div className="grid auto-rows-min divide-y divide-brand-olive/10 min-h-[100vh]">
          {filteredBooks.map((book) => (
            <Article key={book.slug} book={book} />
          ))}

          {filteredBooks.length === 0 && (
            <div className="text-center py-32">
              <p className="text-brand-olive text-lg">No books found matching your filters.</p>
              <Link
                href="/library"
                scroll={false}
                className="inline-block mt-4 text-sm text-brand-olive/80 hover:text-brand-lime transition-colors duration-200"
              >
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </StaggeredAnimation>
    </>
  );
}
