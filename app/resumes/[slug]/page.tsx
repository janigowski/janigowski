import { notFound } from 'next/navigation'
import { allResumes } from 'contentlayer/generated'
import { getMDXComponent } from 'next-contentlayer/hooks'
import { Metadata } from 'next'
import { Resume, ExperienceItem, EducationItem } from '../../../types/resume'
import { Mail, Globe, MapPin } from 'lucide-react'
import Image from 'next/image'
import Line from './Line'
import Company from './Company'

interface PublicSpeakingItem {
    title: string
    event: string
    year: number
}

interface PageProps {
    params: {
        slug: string
    }
}

export async function generateStaticParams() {
    return allResumes.map((resume) => ({
        slug: resume.slug,
    }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resume = allResumes.find((resume) => resume.slug === params.slug)
    if (!resume) return { title: 'Resume Not Found' }
    return { title: resume.title }
}

export default function ResumePage({ params }: PageProps) {
    const resume = allResumes.find((resume) => resume.slug === params.slug)

    if (!resume) {
        notFound()
    }

    const Content = getMDXComponent(resume.body.code)

    return (
        <div className="relative min-h-screen bg-zinc-100">
            <article className="mx-auto bg-white" style={{
                width: '210mm',
                minHeight: '297mm',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}>
                {/* Header Section */}
                <header className="relative mb-8">
                    <div className="relative z-10 p-10 flex justify-between items-start">
                        <div>
                            <h1 className="text-5xl font-bold tracking-tight text-white font-display">{resume.firstName} {resume.lastName}</h1>
                            <h2 className="mt-4 font-mono text-zinc-200">{resume.position}</h2>
                        </div>
                        <div className="text-right text-sm text-zinc-400 space-y-0.5">
                            <div className="flex items-center justify-start gap-2">
                                <Mail className=" w-4 h-4" />
                                <span>{resume.contact.email}</span>
                            </div>
                            <div className="flex items-center justify-start gap-2">
                                <Globe className=" w-4 h-4" />
                                <span>{resume.contact.website}</span>
                            </div>
                            <div className="flex items-center justify-start gap-2">
                                <MapPin className=" w-4 h-4" />
                                <span>{resume.contact.location}</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full z-0">
                        <Image
                            src="/janigowski-large-wallpaper.jpg"
                            alt="Background"
                            fill
                            priority
                            quality={100}
                            sizes="100vw"
                            className="object-cover"
                        />
                    </div>
                </header>

                {/* Main Content */}
                <div className="px-12">
                    {resume.about && (
                        <section className="mb-8">
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                About me
                            </h2>
                            <div className="text-zinc-600 text-sm leading-relaxed">
                                {resume.about}
                            </div>
                        </section>
                    )}

                    {resume.experience && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                Professional Experience
                            </h2>
                            <div className="space-y-6">
                                {resume.experience.map((item: ExperienceItem, i: number) => (
                                    <div key={i} className="grid grid-cols-[120px,1fr] gap-6">
                                        <div className="text-zinc-500 text-sm">{item.period}</div>
                                        <div>
                                            <h3 className="font-semibold text-zinc-800 text-sm">{item.title}</h3>
                                            <Company name={item.company} /> - {item.location}

                                            <p className="text-zinc-600 text-sm leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {resume.education && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                Education
                            </h2>
                            <div className="space-y-6">
                                {resume.education.map((item: EducationItem, i: number) => (
                                    <div key={i} className="grid grid-cols-[120px,1fr] gap-6">
                                        <div className="text-zinc-500 text-sm">{item.period}</div>
                                        <div>
                                            <h3 className="font-semibold text-zinc-800 text-sm">{item.degree}</h3>
                                            <p className="text-zinc-600 text-sm">{item.school} - {item.location}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {resume.expertise && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                Technical Skills
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {resume.expertise.map((skill: string, i: number) => (
                                    <div key={i} className="text-zinc-600 text-sm">
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {resume.leadershipMentoring && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                Leadership & Mentoring
                            </h2>
                            <div className="space-y-2">
                                {resume.leadershipMentoring.map((item: string, i: number) => (
                                    <div key={i} className="text-zinc-600 text-sm">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {resume.publicSpeaking && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                Public Speaking
                            </h2>
                            <div className="space-y-4">
                                {resume.publicSpeaking.map((item: PublicSpeakingItem, i: number) => (
                                    <div key={i} className="text-zinc-600 text-sm">
                                        {item.event} {item.year}: "{item.title}"
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {resume.interests && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                Interests
                            </h2>
                            <div className="space-y-2">
                                {resume.interests.map((item: string, i: number) => (
                                    <div key={i} className="text-zinc-600 text-sm">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="mt-8 prose prose-zinc max-w-none">
                    <Content />
                </div>
            </article>
        </div>
    )
} 