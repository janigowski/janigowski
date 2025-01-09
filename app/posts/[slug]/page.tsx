import { notFound } from "next/navigation";
import { allPosts } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Navigation } from "@/app/components/nav";
import { Header } from "./header";
import "./mdx.css";
import { Metadata } from "next";

export const revalidate = 60;

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = allPosts.find((post) => post.slug === params.slug);

  if (!post) {
    return {
      title: "Post Not Found"
    };
  }

  return {
    title: post.title
  };
}

export async function generateStaticParams(): Promise<Props["params"][]> {
  return allPosts
    .filter((p) => p.published)
    .map((p) => ({
      slug: p.slug,
    }));
}

export default async function PostPage({ params }: Props) {
  const slug = params?.slug;
  const post = allPosts.find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <Header post={post} />
      <article className="px-4 py-12 mx-auto prose prose-quoteless">
        <Mdx code={post.body.code} />
      </article>
    </div>
  );
}
