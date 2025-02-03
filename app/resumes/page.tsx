import { allResumes } from 'contentlayer/generated'
import Link from 'next/link'
import Balancer from 'react-wrap-balancer'

export const metadata = {
    title: 'Resumes',
    description: 'Collection of my professional resumes',
}

function capitalizeAndFormat(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export default function ResumesPage() {
    // Sort variants by slug
    const sortedResumes = [...allResumes].sort((a, b) =>
        a.slug.localeCompare(b.slug)
    )

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
                    {sortedResumes.length === 0 ? (
                        <p className="text-zinc-400">No resumes available.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {sortedResumes.map((resume) => {
                                const resolvedResume = resume.resolvedResume
                                if (!resolvedResume) return null

                                return (
                                    <Link
                                        key={resume.slug}
                                        href={`/resumes/${resume.slug}`}
                                        className="group relative flex flex-col items-start p-6 bg-zinc-900/50 rounded-lg hover:bg-zinc-900/75 transition"
                                    >
                                        <h2 className="text-xl font-semibold text-zinc-100 group-hover:text-brand-lime transition">
                                            <Balancer>{capitalizeAndFormat(resume.slug)}</Balancer>
                                        </h2>
                                        {resolvedResume.summary && (
                                            <p className="mt-4 text-sm text-zinc-400 line-clamp-3">
                                                {resolvedResume.summary}
                                            </p>
                                        )}
                                        <div className="mt-4 text-xs text-zinc-500">
                                            {resolvedResume.label} • {resolvedResume.locationCity}, {resolvedResume.locationCountryCode}
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 