import AnimatedTitle from "./AnimatedTitle";
import StaggeredAnimation from "./StaggeredAnimation";

interface RegularHeaderProps {
    title: string;
    description: React.ReactNode;
}

export function RegularHeader({ title, description }: RegularHeaderProps) {
    return (
        <StaggeredAnimation>
            <div>
                <AnimatedTitle text={title} />
                <div className="mt-10 text-zinc-400">{description}</div>
            </div>
            <div className="mt-10 w-full h-px bg-zinc-700" />
        </StaggeredAnimation>
    );
} 