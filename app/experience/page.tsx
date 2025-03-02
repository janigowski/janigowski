import { Header } from "./header";
import { Metadata } from "next";
import resumeData from "../../resume.json";

export const metadata: Metadata = {
    title: "Experience"
};

interface Project {
    name: string;
    summary?: string;
    highlights?: string[];
}

interface WorkExperience {
    name: string;
    position: string;
    startDate: string;
    endDate?: string;
    highlights: string[];
    projects?: Project[];
    skills: string[];
}

const WorkItem = ({ experience }: { experience: WorkExperience }) => {
    return (
        <div className="mb-16">
            <div className="flex flex-col md:flex-row justify-between mb-2">
                <h3 className="text-2xl font-semibold text-zinc-100">{experience.position}</h3>
                <div className="text-zinc-400">
                    {experience.startDate} — {experience.endDate || "Present"}
                </div>
            </div>
            <div className="text-xl text-zinc-300 mb-4">{experience.name}</div>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-2/3">
                    <div className="mb-6">
                        <ul className="space-y-3 list-disc pl-5">
                            {experience.highlights.map((highlight, index) => (
                                <li key={index} className="text-zinc-300" dangerouslySetInnerHTML={{ __html: highlight }} />
                            ))}
                        </ul>
                    </div>

                    {experience.projects && experience.projects.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-xl font-semibold text-zinc-200 mb-4">Projects</h4>
                            <div className="space-y-6">
                                {experience.projects.map((project, index) => (
                                    <div key={index} className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700/50">
                                        <h5 className="text-lg font-medium text-zinc-100 mb-2">{project.name}</h5>
                                        {project.summary && <p className="text-zinc-300 mb-3">{project.summary}</p>}
                                        {project.highlights && (
                                            <ul className="space-y-2 list-disc pl-5">
                                                {project.highlights.map((highlight, idx) => (
                                                    <li key={idx} className="text-zinc-300" dangerouslySetInnerHTML={{ __html: highlight }} />
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="md:w-1/3">
                    <div className="bg-zinc-800/30 p-5 rounded-lg border border-zinc-700/30 sticky top-24">
                        <h4 className="text-lg font-medium text-zinc-200 mb-3">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {experience.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="inline-block px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm hover:bg-zinc-700 transition-colors duration-200"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ExperiencePage() {
    const workExperience = resumeData.work as WorkExperience[];

    return (
        <>
            <Header />
            <article className="px-4 py-12 mx-auto max-w-5xl">
                <div className="mb-12">
                    <p className="text-lg text-zinc-300 leading-relaxed">
                        With over {resumeData.experience_years} years of experience in software development,
                        I've contributed to {resumeData.products_contributed} digital products across various industries.
                        My journey has shaped me into a product-minded engineer who bridges technical excellence with business impact.
                    </p>
                </div>

                <div>
                    {workExperience.map((experience, index) => (
                        <WorkItem key={index} experience={experience} />
                    ))}
                </div>
            </article>
        </>
    );
} 