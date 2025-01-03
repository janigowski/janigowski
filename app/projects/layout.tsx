import ContentLayout from "../components/content-layout";

export default function ProjectsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <ContentLayout>{children}</ContentLayout>;
}
