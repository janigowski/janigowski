import { notFound } from "next/navigation";
import { allBooks } from "contentlayer/generated";
import { Header } from "./header";
import { Metadata } from "next";
import { Background } from "./background";

export const revalidate = 60;

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = allBooks.find((book) => book.slug === params.slug);

  if (!book) {
    return {
      title: "Book Not Found"
    };
  }

  return {
    title: book.title
  };
}

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
    <div className="min-h-screen">
      <Header book={book} />
      <Background image={book.cover} />
    </div>
  );
}
