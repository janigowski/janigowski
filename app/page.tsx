import React from "react";
import { allBooks, allProjects, allPosts } from "contentlayer/generated";
import Article from "./library/article";
import { Article as ProjectArticle } from "./projects/article";
import { Article as PostArticle } from "./posts/article";
import { RegularHeader } from "./components/regular-header";
import ContentLayout from "./components/content-layout";
import Link from "next/link";
import StaggeredAnimation from "./components/StaggeredAnimation";
import { getLatestBooks } from "./utils/books";
import { getLatestPosts } from "./utils/posts";
import { getRandomProjects } from "./utils/projects";

export default function Home() {
  const latestBooks = getLatestBooks(allBooks, 3);
  const randomProjects = getRandomProjects(allProjects, 3);
  const latestPosts = getLatestPosts(allPosts, 3);
  const bookReviews = allBooks.filter(book => book.body.raw.trim().length > 0).slice(0, 3);

  return (
    <ContentLayout>
      <RegularHeader
        title="janigowski"
        description={
          <>
            <p className="mt-2 text-xl text-zinc-400 italic">yah-nee-gov-ski</p>
          </>
        }
      />

      <div className="mx-auto">
        <div className="max-w-none">
          <StaggeredAnimation staggerDelay={0.3} animationDuration={0.6}>
            <div className="mb-20">
              <p className="text-zinc-400 leading-relaxed">
                I help teams build better products by combining technical expertise with product thinking. Through mentoring and speaking, I share insights on software architecture, product development, and the intersection of technology and business. Here you'll find my thoughts, learnings, and the creative experiments.
              </p>
              <p className="mt-6 text-lg text-zinc-300 leading-relaxed">
                Product Engineer · Software Architect · Mentor · Speaker · Creator
              </p>
            </div>

            {/* Books and Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-zinc-100">Projects</h2>
                  <Link href="/projects" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                    All projects →
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {randomProjects.map((project) => (
                    <ProjectArticle key={project.slug} project={project} />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-zinc-100">Posts</h2>
                  <Link href="/posts" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                    All posts →
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {latestPosts.map((post) => (
                    <PostArticle key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            </div>

            {/* Books Grid */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-zinc-100">Reads</h2>
                  <Link href="/library" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                    All reads →
                  </Link>
                </div>
                <div className="grid auto-rows-min divide-y divide-brand-olive/10">
                  {latestBooks.map((book) => (
                    <Article key={book.slug} book={book} />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-zinc-100">Reviews</h2>
                  <Link href="/library" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                    All reviews →
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {bookReviews.map((book) => (
                    <Article key={book.slug} book={book} />
                  ))}
                </div>
              </div>
            </div>
          </StaggeredAnimation>
        </div>
      </div>
    </ContentLayout>
  );
}
