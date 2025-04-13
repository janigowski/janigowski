import AnimatedTitle from "./AnimatedTitle";

interface RegularHeaderProps {
    title: string;
    description: React.ReactNode;
}

export function RegularHeader({ title, description }: RegularHeaderProps) {
    return (
        <>
            <div>
                <AnimatedTitle text={title} />
                <div className="mt-10 text-zinc-400">{description}</div>
            </div>
            <div className="w-full h-px bg-zinc-700" />
        </>
    );
} 