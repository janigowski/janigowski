import { Metadata } from "next";
import resumeData from "../../resume.json";
import Balancer from "react-wrap-balancer";

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

interface Education {
    institution: string;
    area: string;
    year: string;
    location: string;
}

export const metadata: Metadata = {
    title: "Profile"
};

export default function ProfilePage() {
    const workExperience = resumeData.work;
    const education = resumeData.education;
    const cliftonStrengths = resumeData.clifton_strengths;
    const interests = resumeData.interests;
    const technicalHighlights = resumeData.highlights.technical;
    const experienceYears = resumeData.highlights.numbers.experience_years;
    const productsContributed = resumeData.highlights.numbers.products_contributed;

    return (
        <div className="relative min-h-screen">
            {/* Header Section */}
            <header className="relative isolate overflow-hidden">
                <div className="container mx-auto relative isolate overflow-hidden py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
                        <div className="mx-auto max-w-2xl lg:mx-0">
                            <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-6xl font-display">
                                <Balancer>{resumeData.name}</Balancer>
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-zinc-400">
                                <Balancer><span dangerouslySetInnerHTML={{ __html: resumeData.role }} /></Balancer>
                            </p>
                            <div className="mt-6 flex justify-center gap-4 text-zinc-400 text-sm">
                                <div className='bg-zinc-800/50 px-3 py-1.5 rounded-md'>
                                    <strong>{experienceYears}</strong> years of experience
                                </div>
                                <div className='bg-zinc-800/50 px-3 py-1.5 rounded-md'>
                                    <strong>{productsContributed}</strong> products contributed
                                </div>
                            </div>
                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                {technicalHighlights.map((highlight, index) => (
                                    <span key={index} className="inline-block px-3 py-1.5 bg-zinc-800/30 text-zinc-400 rounded text-sm">
                                        {highlight}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="px-6 mx-auto max-w-7xl lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* About Me and Clifton Strengths */}
                    <div className="mb-16 grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-12">
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-100 mb-6">About Me</h2>
                            <div className="text-lg text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: resumeData.summary }} />
                        </div>
                        <div>
                            <h2 className="text-xl font-medium text-zinc-100 mb-4">Clifton Strengths</h2>
                            <div className="flex flex-wrap gap-2">
                                {cliftonStrengths.map((strength, index) => (
                                    <span key={index} className="inline-block px-3 py-1.5 bg-zinc-800/20 text-zinc-400 rounded text-sm">
                                        {strength}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Work Experience */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-zinc-100 mb-6">Work Experience</h2>
                        {workExperience.map((experience, index) => (
                            <div key={index} className="mb-16">
                                <div className="flex flex-col md:flex-row justify-between mb-2">
                                    <h3 className="text-2xl font-semibold text-zinc-100">{experience.position}</h3>
                                    <div className="text-zinc-400">
                                        {experience.startDate} — {experience.endDate || "Present"}
                                    </div>
                                </div>
                                <div className="text-xl text-zinc-400 mb-6">{experience.name}</div>

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
                                                            {project.summary && <p className="text-zinc-400 mb-6">{project.summary}</p>}
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
                                                    <span key={index} className="inline-block px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm hover:bg-zinc-700 transition-colors duration-200">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Education and Interests */}
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="w-1/2">
                            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Education</h2>
                            {education.map((edu, index) => (
                                <div key={index} className="mb-4">
                                    <div className="flex flex-col md:flex-row justify-between">
                                        <h3 className="text-xl font-medium text-zinc-200">{edu.institution}</h3>
                                        <div className="text-zinc-400 whitespace-nowrap">{edu.year}</div>
                                    </div>
                                    <p className="text-zinc-300">{edu.area}</p>
                                    <p className="text-zinc-400">{edu.location}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex-auto">
                            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Interests</h2>
                            <div className="flex flex-wrap gap-2">
                                {interests.map((interest, index) => (
                                    <span key={index} className="inline-block px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm">
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 