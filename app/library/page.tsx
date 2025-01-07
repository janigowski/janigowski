import Link from "next/link";
import React from "react";
import { allBooks } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Article } from "./article";
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

  const filteredBooks = books.filter((book) => {
    if (selectedType && book.bookType !== selectedType) return false;
    if (selectedTag && book.tag !== selectedTag) return false;
    return true;
  });

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Library
          </h2>
          <p className="mt-4 text-zinc-400">
            Books I've read or am reading.
          </p>
        </div>

        <BookFilters
          types={types}
          tags={tags}
          selectedType={selectedType}
          selectedTag={selectedTag}
        />

        <div className="w-full h-px bg-zinc-800" />

        <div className="flex flex-col space-y-4">
          {filteredBooks.map((book) => (
            <Card key={book.slug}>
              <Article book={book} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
