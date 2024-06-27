import Link from "next/link";
import React from "react";
import { allPosts } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Article } from "./article";
import { Redis } from "@upstash/redis";
import { Eye } from "lucide-react";

const redis = Redis.fromEnv();

export const revalidate = 60;
export default async function postsPage() {
  const views = (
    await redis.mget<number[]>(
      ...allPosts.map((p) => ["pageviews", "posts", p.slug].join(":")),
    )
  ).reduce((acc, v, i) => {
    acc[allPosts[i].slug] = v ?? 0;
    return acc;
  }, {} as Record<string, number>);

  const sorted = allPosts
    .filter((p) => p.published)
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
    );

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Posts
          </h2>
        </div>

        <div className="hidden w-full h-px md:block bg-zinc-800" />

        <div className="flex flex-col space-y-4 mx-auto lg:mx-0 md:grid-cols-3">
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .map((post) => (
                <Card key={post.slug}>
                  <Article post={post} views={views[post.slug] ?? 0} />
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
