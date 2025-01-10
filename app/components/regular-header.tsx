interface RegularHeaderProps {
    title: string;
    description: string;
}

export function RegularHeader({ title, description }: RegularHeaderProps) {
    return (
        <>
            <div>
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-7xl font-display">
                    {title}
                </h2>
                <p className="mt-10 text-zinc-400">{description}</p>
            </div>
            <div className="w-full h-px bg-zinc-700" />
        </>
    );
} 