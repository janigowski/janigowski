import Link from "next/link";
import React from "react";
import { allBooks } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import Article from "./article";
import { BookFilters } from "./filters";

export const revalidate = 60;

function sortBooks(books: typeof allBooks) {
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
      // If neither has a date (waiting status), sort by title
      return a.title.localeCompare(b.title);
    });
}

function getStatistics(books: typeof allBooks) {
  const publishedBooks = books.filter(b => b.published);
  const readBooks = publishedBooks.filter(b => b.status === 'read');
  const readingBooks = publishedBooks.filter(b => b.status === 'reading');
  const waitingBooks = publishedBooks.filter(b => b.status === 'waiting');
  const booksByTag = publishedBooks.reduce((acc, book) => {
    acc[book.tag] = (acc[book.tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const mostReadTag = Object.entries(booksByTag).sort((a, b) => b[1] - a[1])[0];

  return {
    total: publishedBooks.length,
    read: readBooks.length,
    reading: readingBooks.length,
    waiting: waitingBooks.length,
    mostReadCategory: mostReadTag ? `${mostReadTag[0]} (${mostReadTag[1]})` : 'None',
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
  const types = Array.from(new Set(books.map((book) => book.bookType)));
  const tags = Array.from(new Set(books.map((book) => book.tag)));
  const stats = getStatistics(allBooks);

  const filteredBooks = books.filter((book) => {
    if (selectedType && book.bookType !== selectedType) return false;
    if (selectedTag && book.tag !== selectedTag) return false;
    return true;
  });

  return (
    <div className="relative min-h-screen">
      <Navigation />

      {/* Main Content */}
      <div className="relative px-6 pt-24 pb-16 mx-auto max-w-7xl lg:px-8 md:pt-32 lg:pt-40">
        {/* Header */}
        <div className="relative mb-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl font-display">
              Library
            </h1>
            <p className="mt-8 text-lg text-zinc-400">
              A curated collection of books that have shaped my perspective.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="relative mb-32">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Total Books */}
            <div className="group relative overflow-hidden rounded-2xl bg-zinc-800/50 p-6">
              <div className="relative flex flex-col">
                <span className="text-4xl font-medium text-white">{stats.total}</span>
                <span className="mt-2 text-sm text-zinc-400">Books</span>
              </div>
            </div>

            {/* Read */}
            <div className="group relative overflow-hidden rounded-2xl bg-emerald-500/5 p-6">
              <div className="relative flex flex-col">
                <span className="text-4xl font-medium text-emerald-400">{stats.read}</span>
                <span className="mt-2 text-sm text-zinc-400">Read</span>
              </div>
            </div>

            {/* Reading */}
            <div className="group relative overflow-hidden rounded-2xl bg-blue-500/5 p-6">
              <div className="relative flex flex-col">
                <span className="text-4xl font-medium text-blue-400">{stats.reading}</span>
                <span className="mt-2 text-sm text-zinc-400">Reading</span>
              </div>
            </div>

            {/* Waiting */}
            <div className="group relative overflow-hidden rounded-2xl bg-zinc-800/50 p-6">
              <div className="relative flex flex-col">
                <span className="text-4xl font-medium text-white">{stats.waiting}</span>
                <span className="mt-2 text-sm text-zinc-400">Waiting</span>
              </div>
            </div>

            {/* Most Read Category */}
            <div className="group relative overflow-hidden rounded-2xl bg-zinc-800/50 p-6">
              <div className="relative flex flex-col">
                <span className="text-xl font-medium text-white line-clamp-2">{stats.mostReadCategory}</span>
                <span className="mt-2 text-sm text-zinc-400">Most Read</span>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="group relative overflow-hidden rounded-2xl bg-zinc-800/50 p-6">
              <div className="relative flex flex-col">
                <span className="text-4xl font-medium text-white">{stats.completionRate}%</span>
                <span className="mt-2 text-sm text-zinc-400">Completed</span>
              </div>
            </div>
          </div>
        </div>

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
        <div className="grid divide-y divide-zinc-800/50">
          {filteredBooks.map((book) => (
            <Article key={book.slug} book={book} />
          ))}

          {filteredBooks.length === 0 && (
            <div className="text-center py-32">
              <p className="text-zinc-400 text-lg">No books found matching your filters.</p>
              <Link
                href="/library"
                className="inline-block mt-4 text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
              >
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
