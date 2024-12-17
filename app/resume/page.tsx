"use client";
import { Github, Mail, Twitter, Linkedin, Calendar, MapPin, Building2 } from "lucide-react";
import Link from "next/link";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";

const experience = [
    {
        title: "Creator",
        company: "janigowski.dev",
        location: "Remote",
        period: "2022 - Present",
        description: [
            "Led cross-functional team of 8 engineers building API authentication platform",
            "Increased team velocity by 40% through process improvements and technical mentorship",
            "Implemented agile methodologies and engineering best practices",
            "Drove technical architecture decisions and maintained high code quality standards"
        ]
    },
    {
        title: "Senior Frontend Engineer",
        company: "Netguru",
        location: "Remote",
        period: "2019 - 2022",
        description: [
            "Led frontend development for enterprise client projects",
            "Mentored junior developers and conducted technical interviews",
            "Architected scalable React applications using modern best practices",
            "Collaborated with product and design teams to deliver high-quality user experiences"
        ]
    },
    {
        title: "Frontend Engineer",
        company: "Various Companies",
        location: "Poland",
        period: "2012 - 2019",
        description: [
            "Developed responsive web applications using React, Angular and Vue",
            "Implemented CI/CD pipelines and testing strategies",
            "Collaborated in agile teams to deliver client projects"
        ]
    }
];

const skills = {
    leadership: [
        "Engineering Management",
        "Team Building",
        "Agile Methodologies",
        "Technical Mentorship",
        "Process Improvement"
    ],
    technical: [
        "React/Next.js",
        "TypeScript",
        "Node.js",
        "System Design",
        "CI/CD",
        "Testing Strategies"
    ]
};

export default function Resume() {
    return (
        <div className="min-h-screen bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Dawid Janiga
                    </h1>
                    <h2 className="text-xl text-zinc-200 mb-3">
                        Engineering Manager
                    </h2>
                    <div className="flex flex-wrap gap-3 text-zinc-400 text-sm">
                        <div className="flex items-center gap-1">
                            <Mail size={14} />
                            <Link href="mailto:dev@janigowski.com" className="hover:text-white">
                                dev@janigowski.com
                            </Link>
                        </div>
                        <div className="flex items-center gap-1">
                            <Github size={14} />
                            <Link href="https://github.com/dawidjaniga" className="hover:text-white" target="_blank">
                                github.com/dawidjaniga
                            </Link>
                        </div>
                        <div className="flex items-center gap-1">
                            <Twitter size={14} />
                            <Link href="https://twitter.com/dawidjaniga" className="hover:text-white" target="_blank">
                                @dawidjaniga
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <Card>
                    <div className="p-4">
                        <p className="text-zinc-300 text-sm leading-relaxed">
                            Engineering leader with 12+ years of experience, including 2+ years in engineering management.
                            Practice radical candor and servant leadership style to foster growth and innovation.
                            Proven track record of scaling engineering teams and implementing effective processes.
                        </p>
                    </div>
                </Card>

                {/* Experience */}
                <div className="mt-6">
                    <h3 className="text-xl font-semibold text-white mb-3">Experience</h3>
                    <div className="space-y-3">
                        {experience.map((job, index) => (
                            <Card key={index}>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-lg font-medium text-white">{job.title}</h4>
                                            <div className="text-zinc-400 text-sm">
                                                <span className="flex items-center gap-1">
                                                    <Building2 size={14} />
                                                    {job.company}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right text-zinc-400 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {job.period}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} />
                                                {job.location}
                                            </div>
                                        </div>
                                    </div>
                                    <ul className="list-disc list-inside text-zinc-300 text-sm space-y-1">
                                        {job.description.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Skills */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-white mb-2">Leadership Skills</h3>
                            <div className="flex flex-wrap gap-1">
                                {skills.leadership.map((skill, index) => (
                                    <span key={index} className="px-2 py-0.5 bg-zinc-800 rounded-full text-zinc-300 text-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-white mb-2">Technical Skills</h3>
                            <div className="flex flex-wrap gap-1">
                                {skills.technical.map((skill, index) => (
                                    <span key={index} className="px-2 py-0.5 bg-zinc-800 rounded-full text-zinc-300 text-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
