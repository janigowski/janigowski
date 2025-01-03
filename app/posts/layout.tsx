import ContentLayout from "../components/content-layout";

export default function PostsLayout({
	children,
}: { children: React.ReactNode }) {
	return <ContentLayout>{children}</ContentLayout>;
}
