import { notFound } from 'next/navigation'
import { allResumes } from 'contentlayer/generated'
import { getMDXComponent } from 'next-contentlayer/hooks'
import { Metadata } from 'next'
import { Resume } from '../../../types/resume'

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
        <div className="relative min-h-screen">
            <header className="relative isolate overflow-hidden">
                <div className="container mx-auto relative isolate overflow-hidden py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
                        <div className="mx-auto max-w-2xl lg:mx-0">
                            <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-6xl font-display">
                                {resume.title}
                            </h1>
                            {resume.date && (
                                <time className="mt-4 block text-sm text-zinc-400" dateTime={resume.date}>
                                    {new Date(resume.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="relative pb-16">
                <article className="mx-auto bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50" style={{
                    width: '210mm',
                    minHeight: '297mm',
                    padding: '20mm',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    margin: '0 auto',
                }}>
                    {resume.sections.map((section: { title: string; content: string }, index: number) => (
                        <section key={index} className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-zinc-100">{section.title}</h2>
                            <div className="prose prose-invert prose-zinc max-w-none prose-a:text-brand-lime prose-headings:text-zinc-100 prose-p:text-zinc-300">
                                {section.content}
                            </div>
                        </section>
                    ))}

                    <div className="prose prose-invert prose-zinc max-w-none prose-a:text-brand-lime prose-headings:text-zinc-100 prose-p:text-zinc-300">
                        <Content />
                    </div>
                </article>
            </div>
        </div>
    )
} 