import React from "react";
import { allPosts } from "contentlayer/generated";
import { Card } from "../components/card";
import { Article } from "./article";
import { Metadata } from "next";
import { RegularHeader } from "../components/regular-header";

export const metadata: Metadata = {
  title: "Posts"
};

export const revalidate = 60;
export default async function postsPage() {
  const sorted = allPosts
    .filter((p) => p.published)
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
    );

  return (
    <>
      <RegularHeader
        title="Posts"
        description="Just sharing my perspective on things"
      />

      <div className="flex flex-col space-y-4 mx-auto lg:mx-0 md:grid-cols-3">
        <div className="grid grid-cols-1 gap-4">
          {sorted
            .map((post) => (
              <Card key={post.slug}>
                <Article post={post} />
              </Card>
            ))}
        </div>
      </div>
    </>
  );
}
