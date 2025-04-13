interface RegularHeaderProps {
    title: string;
    description: React.ReactNode;
}

export function RegularHeader({ title, description }: RegularHeaderProps) {
    return (
        <>
            <div>
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-7xl font-display">
                    {title}
                </h2>
                <div className="mt-10 text-zinc-400">{description}</div>
            </div>
            <div className="w-full h-px bg-zinc-700" />
        </>
    );
} 