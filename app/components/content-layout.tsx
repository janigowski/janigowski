export default function ContentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen">
            <div className="relative pb-16">
                <div className="container mx-auto px-6 pt-40 space-y-8 lg:px-8 md:space-y-16">
                    {children}
                </div>
            </div>
        </div>
    );
} 