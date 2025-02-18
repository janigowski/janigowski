import ContentLayout from "../components/content-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Lamp"
};

export default function LampLayout({
	children,
}: { children: React.ReactNode }) {
	return <ContentLayout>{children}</ContentLayout>;
}
