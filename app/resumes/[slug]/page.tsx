import { notFound } from 'next/navigation'
import { allResumes } from 'contentlayer/generated'
import { Metadata } from 'next'
import { Profile, Work, Education, Skill, Interest, Volunteer, Presentation } from '../../../types/resume'
import { Mail, Globe, MapPin } from 'lucide-react'
import Image from 'next/image'
import Line from './Line'
import Company from './Company'
import Contact from './Contact'

interface Talk {
    date: string
    conference: string
    place: string
    title: string
}

interface Hackathon {
    name: string
    achievement?: string
}

interface PageProps {
    params: {
        slug: string
    }
}

export async function generateStaticParams() {
    return allResumes.map(resume => ({
        slug: resume.slug
    }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resume = allResumes.find(r => r.slug === params.slug)
    if (!resume?.resolvedResume) return { title: 'Resume Not Found' }

    const resolvedResume = resume.resolvedResume
    return {
        title: `${resolvedResume.name} - ${resolvedResume.role}`,
        description: resolvedResume.summary
    }
}

export default function ResumePage({ params }: PageProps) {
    const resume = allResumes.find(r => r.slug === params.slug)
    const resolvedResume = resume?.resolvedResume

    if (!resolvedResume) {
        console.error('Resume not found:', params.slug)
        notFound()
    }

    const {
        name,
        role,
        email,
        url,
        summary,
        locationCity,
        locationCountryCode,
        profiles,
        highlights,
        clifton_strengths,
        work = [],
        education = [],
        skills = [],
        interests = [],
        talks = [],
        hackathons = [],
        mentoring
    } = resolvedResume

    // Split name into first and last name
    const [firstName, lastName] = name.split(' ')

    // Get last 3 talks
    const recentTalks = talks.slice(0, 3)

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
                            <h2 className="mt-4 font-mono text-zinc-200">{role}</h2>
                            {highlights?.technical?.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {highlights.technical.map((skill: string, i: number) => (
                                        <span key={i} className="inline-block px-2 py-1 text-xs bg-white/10 text-white/80 rounded">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {highlights?.numbers && (
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div className="text-zinc-200 text-sm">
                                        <strong className="text-white">{highlights.numbers.experience_years}</strong> years of experience
                                    </div>
                                    <div className="text-zinc-200 text-sm">
                                        <strong className="text-white">{highlights.numbers.products_contributed}</strong> products contributed
                                    </div>
                                </div>
                            )}
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

                    {/* Education and Personality Row */}
                    <div className="grid grid-cols-3 gap-8 mb-8">
                        {education && education.length > 0 && (
                            <section className="col-span-1">
                                <Line />
                                <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                    Education
                                </h2>
                                <div className="space-y-6">
                                    {education.map((item: Education, i: number) => (
                                        <div key={i}>
                                            <h3 className="font-semibold text-zinc-800 text-sm">{item.area}</h3>
                                            <p className="text-zinc-600 text-sm">{item.institution} - {item.location}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className="col-span-2">
                            <Line />
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                Clifton Strengths
                            </h2>
                            <div className="space-y-4">
                                {clifton_strengths?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {clifton_strengths.map((strength: string, i: number) => (
                                            <span key={i} className="inline-block px-2 py-1 text-xs bg-zinc-100 rounded">
                                                {strength}
                                            </span>
                                        ))}
                                    </div>

                                )}
                            </div>
                        </section>
                    </div>

                    {work && work.length > 0 && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                Experience
                            </h2>
                            <div className="space-y-6">
                                {work.map((job: Work, index: number) => (
                                    <div key={index} className="grid grid-cols-[1fr,120px] gap-6">
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
                                        <div className="text-zinc-500 text-sm text-right">
                                            {job.startDate} - {job.endDate || 'Present'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {mentoring && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                Mentoring
                            </h2>
                            <div className="space-y-6">
                                <div className="grid grid-cols-[1fr,120px] gap-6">
                                    <div>
                                        <div className='flex row justify-between mb-2'>
                                            <h3 className="font-normal text-zinc-800 text-sm uppercase">{mentoring.position}</h3>
                                            <div className='flex row text-sm'>
                                                <Company name={mentoring.name} />
                                            </div>
                                        </div>
                                        <div className="text-zinc-600 text-sm leading-relaxed">
                                            <p>{mentoring.summary}</p>
                                            {mentoring.highlights && mentoring.highlights.length > 0 && (
                                                <ul className="mt-2 list-disc list-inside">
                                                    {mentoring.highlights.map((highlight: string, i: number) => (
                                                        <li key={i}>{highlight}</li>
                                                    ))}
                                                </ul>
                                            )}
                                            {mentoring.impact && mentoring.impact.length > 0 && (
                                                <>
                                                    <h4 className="mt-4 font-medium">Impact:</h4>
                                                    <ul className="mt-2 list-disc list-inside">
                                                        {mentoring.impact.map((impact: string, i: number) => (
                                                            <li key={i}>{impact}</li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}
                                            {mentoring.technologies && mentoring.technologies.length > 0 && (
                                                <>
                                                    <h4 className="mt-4 font-medium">Technologies:</h4>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {mentoring.technologies.map((tech: string, i: number) => (
                                                            <span key={i} className="inline-block px-2 py-1 text-xs bg-zinc-100 rounded">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-zinc-500 text-sm text-right">
                                        {mentoring.startDate} - Present
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Education and Talks Row */}
                    <div className="grid grid-cols-3 gap-8 mb-8">
                        {education && education.length > 0 && (
                            <section className="col-span-1">
                                <Line />
                                <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                    Education
                                </h2>
                                <div className="space-y-6">
                                    {education.map((item: Education, i: number) => (
                                        <div key={i}>
                                            <h3 className="font-semibold text-zinc-800 text-sm">{item.area}</h3>
                                            <p className="text-zinc-600 text-sm">{item.institution} - {item.location}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {recentTalks.length > 0 && (
                            <section className="col-span-2">
                                <Line />
                                <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                    Talks
                                </h2>
                                <div className="space-y-4">
                                    {recentTalks.map((talk: Talk, i: number) => (
                                        <div key={i} className="grid grid-cols-[1fr,120px] gap-6">
                                            <div>
                                                <h3 className="font-medium text-zinc-800 text-sm">{talk.title}</h3>
                                                <p className="text-zinc-600 text-sm">
                                                    {talk.conference} @ {talk.place}
                                                </p>
                                            </div>
                                            <div className="text-zinc-500 text-sm text-right">
                                                {talk.date}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {hackathons && hackathons.length > 0 && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                Hackathons
                            </h2>
                            <div className="space-y-4">
                                <p className="text-zinc-600 text-sm">
                                    Spent <strong>152 hours</strong> in {hackathons.length} hackathons. My keyboard has more coffee stains than my coffee mug.
                                </p>
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