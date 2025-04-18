import Link from "next/link";
import React from "react";
import { allProjects } from "contentlayer/generated";
import { Card } from "../components/card";
import { Article } from "./article";
import { Metadata } from "next";
import { RegularHeader } from "../components/regular-header";
import StaggeredAnimation from "../components/StaggeredAnimation";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects"
};

export default async function ProjectsPage() {
  const featured = allProjects.find((project) => project.slug === "exo-lab")!;
  const top2 = allProjects.find((project) => project.slug === "mars-explorer")!;
  const top3 = allProjects.find((project) => project.slug === "wikipedia-map")!;
  const sorted = allProjects
    .filter((p) => p.published)
    .filter(
      (project) =>
        project.slug !== featured.slug &&
        project.slug !== top2.slug &&
        project.slug !== top3.slug,
    )
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
    );

  return (
    <>
      <RegularHeader
        title="Projects"
        description="Things I've built"
      />


      <StaggeredAnimation delay={0.6} staggerDelay={0.3} animationDuration={0.6} className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 ">
        <Card>
          <Link href={`/projects/${featured.slug}`}>
            <article className="relative w-full h-full p-4 md:p-8">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-zinc-100">
                  {featured.date ? (
                    <time dateTime={new Date(featured.date).toISOString()}>
                      {Intl.DateTimeFormat(undefined, {
                        dateStyle: "medium",
                      }).format(new Date(featured.date))}
                    </time>
                  ) : (
                    <span>SOON</span>
                  )}
                </div>
              </div>

              <h2 className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display">
                {featured.title}
              </h2>
              <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                {featured.description}
              </p>
              <div className="absolute bottom-4 md:bottom-8">
                <p className="hidden text-zinc-200 hover:text-zinc-50 lg:block">
                  Read more <span aria-hidden="true">&rarr;</span>
                </p>
              </div>
            </article>
          </Link>
        </Card>

        <div className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0">
          {[top2, top3].map((project) => (
            <Card key={project.slug}>
              <Article project={project} />
            </Card>
          ))}
        </div>
      </StaggeredAnimation>

      <StaggeredAnimation delay={0.9} animationDuration={0.6}>
        <div className="hidden w-full h-px md:block bg-zinc-800" />

        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 0)
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 1)
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 2)
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} />
                </Card>
              ))}
          </div>
        </div>
      </StaggeredAnimation>
    </>
  );
}
