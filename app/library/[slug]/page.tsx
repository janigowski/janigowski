import { notFound } from "next/navigation";
import { allBooks } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import "./mdx.css";

export const revalidate = 60;

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams(): Promise<Props["params"][]> {
  return allBooks
    .filter((p) => p.published)
    .map((p) => ({
      slug: p.slug,
    }));
}

export default async function PostPage({ params }: Props) {
  const slug = params?.slug;
  const book = allBooks.find((book) => book.slug === slug);

  if (!book) {
    notFound();
  }

  return (
    <div className=" min-h-screen">
      <Header book={book} />

      <article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
        <Mdx code={book.body.code} />
      </article>
    </div>
  );
}
