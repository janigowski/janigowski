import React from "react";
import { allPosts, allBooks } from "contentlayer/generated";
import { Card } from "../components/card";
import { Article } from "./article";
import BookArticle from "../library/article";
import { Metadata } from "next";
import { RegularHeader } from "../components/regular-header";
import StaggeredAnimation from "../components/StaggeredAnimation";

export const metadata: Metadata = {
  title: "Posts"
};

export const revalidate = 60;
export default async function postsPage() {
  const sortedPosts = allPosts
    .filter((p) => p.published)
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
    );

  const sortedBooks = allBooks
    .filter((b) => b.published && b.body.raw.trim().length > 0)
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
    );

  const allContent = [...sortedPosts, ...sortedBooks].sort(
    (a, b) =>
      new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
      new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
  );

  return (
    <>
      <RegularHeader
        title="Posts & Book Reviews"
        description="Just sharing my perspective on things"
      />

      <StaggeredAnimation staggerDelay={0.3} animationDuration={0.6}>
        <div className="flex flex-col space-y-4 mx-auto lg:mx-0 md:grid-cols-3">
          <div className="grid grid-cols-1 gap-4">
            {allContent.map((item) => (
              <Card key={item.slug}>
                {item.type === "Post" ? (
                  <Article post={item} />
                ) : (
                  <BookArticle book={item} />
                )}
              </Card>
            ))}
          </div>
        </div>
      </StaggeredAnimation>
    </>
  );
}
