import { allResumes } from 'contentlayer/generated'
import { Resume } from '../../types/resume'
import Link from 'next/link'
import Balancer from 'react-wrap-balancer'

export const metadata = {
    title: 'Resumes',
    description: 'Collection of my professional resumes',
}

export default function ResumesPage() {
    const resumes: Resume[] = allResumes

    return (
        <div className="relative min-h-screen">
            <header className="relative isolate overflow-hidden">
                <div className="container mx-auto relative isolate overflow-hidden py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
                        <div className="mx-auto max-w-2xl lg:mx-0">
                            <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-6xl font-display">
                                <Balancer>Resumes</Balancer>
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-zinc-400">
                                <Balancer>Collection of my professional resumes</Balancer>
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="px-6 mx-auto max-w-7xl lg:px-8">
                <div className="max-w-2xl mx-auto lg:max-w-none">
                    {resumes.length === 0 ? (
                        <p className="text-zinc-400">No resumes available.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {resumes.map((resume) => (
                                <Link
                                    key={resume.slug}
                                    href={`/resumes/${resume.slug}`}
                                    className="group relative flex flex-col items-start"
                                >
                                    <h2 className="text-xl font-semibold text-zinc-100 group-hover:text-brand-lime transition">
                                        <Balancer>{resume.title}</Balancer>
                                    </h2>
                                    {resume.date && (
                                        <time className="relative z-10 order-first mb-3 flex items-center text-sm text-zinc-400 pl-3.5">
                                            <span className="absolute inset-y-0 left-0 flex items-center">
                                                <span className="h-4 w-0.5 rounded-full bg-zinc-700" />
                                            </span>
                                            {new Date(resume.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </time>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 