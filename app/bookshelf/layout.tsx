import ContentLayout from "../components/content-layout";

export default function BookshelfLayout({
	children,
}: { children: React.ReactNode }) {
	return <ContentLayout>{children}</ContentLayout>;
}
