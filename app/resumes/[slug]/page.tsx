import { notFound } from 'next/navigation'
import { allResumeExtensions } from 'contentlayer/generated'
import { Metadata } from 'next'
import { Profile, Work, Education, Skill, Interest } from '../../../types/resume'
import { Mail, Globe, MapPin } from 'lucide-react'
import Image from 'next/image'
import Line from './Line'
import Company from './Company'
import Contact from './Contact'

interface PageProps {
    params: {
        slug: string
    }
}

export async function generateStaticParams() {
    return allResumeExtensions.map((resume) => ({
        slug: resume.slug,
    }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resume = allResumeExtensions.find((resume) => resume.slug === params.slug)
    if (!resume) return { title: 'Resume Not Found' }
    return { title: `${resume.mergedResume.name} - ${resume.mergedResume.label}` }
}

export default function ResumePage({ params }: PageProps) {
    const resumeExt = allResumeExtensions.find((resume) => resume.slug === params.slug)

    if (!resumeExt) {
        console.error('Resume extension not found:', params.slug)
        notFound()
    }

    const resume = resumeExt.mergedResume
    if (!resume) {
        console.error('Merged resume data is missing:', resumeExt)
        notFound()
    }

    // Validate required fields
    const requiredFields = ['name', 'label', 'email', 'url', 'locationCity', 'locationCountryCode', 'profiles']
    const missingFields = requiredFields.filter(field => !resume[field])

    if (missingFields.length > 0) {
        console.error('Missing required fields in resume:', missingFields)
        console.error('Resume data:', resume)
        notFound()
    }

    const { name, label, email, url, summary, locationCity, locationCountryCode, profiles, work, education, skills, interests } = resume

    // Split name into first and last name
    const [firstName, lastName] = name.split(' ')

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
                            <h1 className="text-5xl font-bold tracking-tight text-white font-display">
                                {firstName} {lastName}
                            </h1>
                            <h2 className="mt-4 font-mono text-zinc-200">{label}</h2>
                        </div>
                        <Contact
                            email={email}
                            website={url}
                            location={`${locationCity}, ${locationCountryCode}`}
                            github={profiles?.find((p: Profile) => p.network === 'GitHub')?.url}
                            linkedin={profiles?.find((p: Profile) => p.network === 'LinkedIn')?.url}
                        />
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full z-0">
                        <Image
                            src="/janigowski-large-wallpaper.jpg"
                            alt="Background"
                            fill
                            priority
                            quality={75}
                            sizes="100vw"
                            className="object-cover"
                        />
                    </div>
                </header>

                {/* Main Content */}
                <div className="px-12">
                    {summary && (
                        <section className="mb-8">
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                About me
                            </h2>
                            <div className="text-zinc-600 text-sm leading-relaxed">
                                {summary}
                            </div>
                        </section>
                    )}

                    {work && work.length > 0 && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                Experience
                            </h2>
                            <div className="space-y-6">
                                {work.map((job: Work, index: number) => (
                                    <div key={index} className="grid grid-cols-[120px,1fr] gap-6">
                                        <div className="text-zinc-500 text-sm">
                                            {job.startDate} - {job.endDate || 'Present'}
                                        </div>
                                        <div>
                                            <div className='flex row justify-between mb-2'>
                                                <h3 className="font-normal text-zinc-800 text-sm uppercase">{job.position}</h3>
                                                <div className='flex row text-sm'>
                                                    <Company name={job.name} />
                                                </div>
                                            </div>
                                            <div className="text-zinc-600 text-sm leading-relaxed">
                                                <p>{job.summary}</p>
                                                {job.highlights && job.highlights.length > 0 && (
                                                    <ul className="mt-2 list-disc list-inside">
                                                        {job.highlights.map((highlight: string, i: number) => (
                                                            <li key={i}>{highlight}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {education && education.length > 0 && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                Education
                            </h2>
                            <div className="space-y-6">
                                {education.map((item: Education, i: number) => (
                                    <div key={i} className="grid grid-cols-[120px,1fr] gap-6">
                                        <div className="text-zinc-500 text-sm"></div>
                                        <div>
                                            <h3 className="font-semibold text-zinc-800 text-sm">{item.area}</h3>
                                            <p className="text-zinc-600 text-sm">{item.institution} - {item.location}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {skills && skills.length > 0 && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                Skills
                            </h2>
                            <div className="space-y-4">
                                {skills.map((skillGroup: Skill, i: number) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-medium text-zinc-700 mb-2">{skillGroup.name}</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {skillGroup.keywords.map((skill: string, j: number) => (
                                                <div key={j} className="text-zinc-600 text-sm">
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {interests && interests.length > 0 && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                Interests
                            </h2>
                            <div className="space-y-4">
                                {interests.map((interestGroup: Interest, i: number) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-medium text-zinc-700 mb-2">{interestGroup.name}</h3>
                                        <div className="space-y-2">
                                            {interestGroup.keywords.map((interest: string, j: number) => (
                                                <div key={j} className="text-zinc-600 text-sm">
                                                    {interest}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </article>
        </div>
    )
} 