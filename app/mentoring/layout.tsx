import ContentLayout from "../components/content-layout";

export default function MentoringLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ContentLayout>{children}</ContentLayout>;
}