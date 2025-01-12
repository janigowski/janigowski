import React from 'react';
import ContentLayout from "../components/content-layout";

export default function PublicSpeakingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ContentLayout>{children}</ContentLayout>;
} 