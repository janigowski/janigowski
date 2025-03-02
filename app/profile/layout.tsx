import ContentLayout from "../components/content-layout";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ContentLayout>{children}</ContentLayout>;
} 