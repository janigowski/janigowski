import ContentLayout from "../components/content-layout";

export default function LibraryLayout({
	children,
}: { children: React.ReactNode }) {
	return <ContentLayout>{children}</ContentLayout>;
}
