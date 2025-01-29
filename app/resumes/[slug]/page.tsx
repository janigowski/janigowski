import { notFound } from 'next/navigation'
import { allResumes } from 'contentlayer/generated'
import { getMDXComponent } from 'next-contentlayer/hooks'
import { Metadata } from 'next'
import { Resume, ResumeSection, ExperienceItem, EducationItem } from '../../../types/resume'
import { Phone, Mail, Globe, MapPin } from 'lucide-react'

interface PageProps {
    params: {
        slug: string
    }
}

export async function generateStaticParams() {
    return allResumes.map((resume: Resume) => ({
        slug: resume.slug,
    }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resume = allResumes.find((resume: Resume) => resume.slug === params.slug)
    if (!resume) return { title: 'Resume Not Found' }
    return { title: resume.title }
}

export default function ResumePage({ params }: PageProps) {
    const resume = allResumes.find((resume: Resume) => resume.slug === params.slug)

    if (!resume) {
        notFound()
    }

    const Content = getMDXComponent(resume.body.code)

    return (
        <div className="relative min-h-screen bg-zinc-100 py-8">
            <article className="mx-auto bg-white" style={{
                width: '210mm',
                minHeight: '297mm',
                padding: '20mm',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}>
                {/* Header Section */}
                <header className="mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-bold text-zinc-800">{resume.firstName}</h1>
                            <h1 className="text-4xl font-bold text-zinc-800 mb-1">{resume.lastName}</h1>
                            <h2 className="text-base text-zinc-600">{resume.position}</h2>
                        </div>
                        <div className="text-right text-sm text-zinc-600 space-y-0.5">
                            <div className="flex items-center justify-end gap-2">
                                <Phone className="w-4 h-4 text-zinc-400" />
                                <span>{resume.contact.phone}</span>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <Mail className="w-4 h-4 text-zinc-400" />
                                <span>{resume.contact.email}</span>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <Globe className="w-4 h-4 text-zinc-400" />
                                <span>{resume.contact.website}</span>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <MapPin className="w-4 h-4 text-zinc-400" />
                                <span>{resume.contact.location}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div>
                    {resume.sections.map((section: ResumeSection, index: number) => (
                        <section key={index} className="mb-8">
                            {index > 0 && <hr className="border-zinc-200 mb-8" />}
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                {section.title}
                            </h2>
                            {section.type === 'about' && section.content && (
                                <div className="text-zinc-600 text-sm leading-relaxed">
                                    {section.content}
                                </div>
                            )}
                            {section.type === 'experience' && section.items && (
                                <div className="space-y-6">
                                    {(section.items as ExperienceItem[]).map((item, i) => (
                                        <div key={i} className="grid grid-cols-[120px,1fr] gap-6">
                                            <div className="text-zinc-500 text-sm">{item.period}</div>
                                            <div>
                                                <h3 className="font-semibold text-zinc-800 text-sm">{item.title}</h3>
                                                <p className="text-zinc-600 text-sm mb-2">{item.company} - {item.location}</p>
                                                <p className="text-zinc-600 text-sm leading-relaxed">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {section.type === 'education' && section.items && (
                                <div className="grid grid-cols-2 gap-x-8">
                                    {(section.items as EducationItem[]).map((item, i) => (
                                        <div key={i} className="grid grid-cols-[120px,1fr] gap-6">
                                            <div className="text-zinc-500 text-sm">{item.period}</div>
                                            <div>
                                                <h3 className="font-semibold text-zinc-800 text-sm">{item.degree}</h3>
                                                <p className="text-zinc-600 text-sm">{item.school} - {item.location}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    ))}
                </div>

                <div className="mt-8 prose prose-zinc max-w-none">
                    <Content />
                </div>
            </article>
        </div>
    )
} 