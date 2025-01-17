import { Header } from "./header";
import { Metadata } from "next";
import { ListItem } from "../components/list-item";

export const metadata: Metadata = {
    title: "Mentoring"
};

export default function MentoringPage() {
    return (
        <>
            <Header />
            <article className="px-4 py-12 mx-auto prose prose-quoteless max-w-2xl">
                <p className="leading-7 text-zinc-300 [&:not(:first-child)]:mt-6">
                    Drawing from my experience as a Product Engineer and Software Architect, I offer focused mentoring sessions to help you navigate technical challenges and accelerate your professional growth.
                </p>

                <h2 className="mt-10 scroll-m-20 pb-1 text-3xl font-semibold tracking-tight text-zinc-100 first:mt-0">Areas of Focus</h2>
                <ul className="my-6 ml-6 space-y-4">
                    <ListItem>Software Architecture & System Design</ListItem>
                    <ListItem>Frontend Engineering</ListItem>
                    <ListItem>Product Development & Technical Leadership</ListItem>
                    <ListItem>Career Growth & Team Building</ListItem>
                </ul>

                <h2 className="mt-10 scroll-m-20 pb-1 text-3xl font-semibold tracking-tight text-zinc-100 first:mt-0">What to Expect</h2>
                <p className="leading-7 text-zinc-300 [&:not(:first-child)]:mt-6">
                    Each session is tailored to your specific needs and challenges. Whether you're looking to level up your technical skills, navigate architectural decisions, or grow as a technical leader, we'll work together to find practical solutions and actionable insights.
                </p>

                <div className="w-full max-w-[650px] h-[496px] rounded-2xl overflow-hidden mb-16 mx-auto mt-12">
                    <iframe
                        src="https://adplist.org/widgets/single-session?src=dawid-janiga&amp;session=35227-mentorship-session"
                        title="Mentorship Session"
                        className="w-full h-full border-0"
                        loading="lazy"
                    />
                </div>

                <h2 className="mt-10 scroll-m-20 pb-1 text-3xl font-semibold tracking-tight text-zinc-100 first:mt-0 text-center">Reviews</h2>
                <div className="w-full max-w-[650px] h-[1060px] rounded-2xl overflow-hidden mb-16 mx-auto">
                    <iframe
                        src="https://adplist.org/widgets/reviews?src=dawid-janiga"
                        title="All Reviews"
                        className="w-full h-full border-0"
                        loading="lazy"
                    />
                </div>

                <h2 className="mt-10 scroll-m-20 pb-1 text-3xl font-semibold tracking-tight text-zinc-100 first:mt-0 text-center">Impact</h2>
                <div className="w-full max-w-[650px] h-[850px] rounded-2xl overflow-hidden mx-auto">
                    <iframe
                        src="https://adplist.org/widgets/impact?src=dawid-janiga"
                        title="Impact"
                        className="w-full h-full border-0"
                        loading="lazy"
                    />
                </div>
            </article>
        </>
    );
} 