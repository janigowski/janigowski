import { Metadata } from "next";
import ContentLayout from "../components/content-layout";

export const metadata: Metadata = {
    title: "Contact"
};

export default function ContactLayout({
    children,
}: { children: React.ReactNode }) {
    return <ContentLayout>{children}</ContentLayout>;
}
