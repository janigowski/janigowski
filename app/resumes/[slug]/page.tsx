import { notFound } from 'next/navigation'
import { allResumes, Resume } from 'contentlayer/generated'
import type { Metadata } from 'next'
import Image from 'next/image'
import Line from './Line'
import Company from './Company'
import Contact from './Contact'
import Work from './Work'

interface Talk {
    date: string
    conference: string
    place: string
    title: string
}

type Profile = Resume['profiles'][number]
type Education = Resume['education'][number]
type Interest = Resume['interests'][number]

interface ResumePageProps {
    params: {
        slug: string
    }
}

export async function generateStaticParams() {
    return allResumes.map(resume => ({
        slug: resume.slug
    }))
}

export async function generateMetadata({ params }: ResumePageProps): Promise<Metadata> {
    const resume = allResumes.find(r => r.slug === params.slug)
    if (!resume?.resolvedResume) return { title: 'Resume Not Found' }

    const resolvedResume = resume.resolvedResume
    return {
        title: `${resolvedResume.name} - ${resolvedResume.role}`,
        description: resolvedResume.summary
    }
}

export default function ResumePage({ params }: ResumePageProps) {
    const resume = allResumes.find((r) => r.slug === params.slug)

    if (!resume) {
        notFound()
    }

    const resolvedResume = resume.resolvedResume

    // Split name into first and last name
    const [firstName, lastName] = resolvedResume.name.split(' ')

    return (
        <div className="relative min-h-screen bg-zinc-100">
            <article className="mx-auto bg-white" style={{
                width: '210mm',
                minHeight: '297mm',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}>
                {/* Header Section */}
                <header className="relative mb-8">
                    <div className="relative z-10 px-10 py-6 flex justify-between items-start">
                        <div className='flex flex-col justify-between'>
                            <h1 className="text-3xl px-2 leading-none mb-6 font-bold tracking-tight text-white font-display">
                                {firstName} {lastName}
                            </h1>

                            <div className="text-xs px-2 mb-4  text-zinc-200 " dangerouslySetInnerHTML={{
                                __html: resolvedResume.role
                            }} />

                            <div className="flex gap-4 mb-4 text-zinc-400 text-xs">
                                <div className='bg-zinc-800/50 px-2 py-1 rounded-md'>
                                    <strong >{resolvedResume.highlights.numbers.experience_years}</strong> years of experience
                                </div>
                                <div className='bg-zinc-800/50 px-2 py-1 rounded-md'>
                                    <strong >{resolvedResume.highlights.numbers.products_contributed}</strong> products contributed
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 text-xs text-zinc-500 ">
                                {resolvedResume.highlights.technical.map((skill: string, i: number) => (
                                    <span key={i} className='bg-zinc-900/20 px-2 py-1 rounded-md'>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <Contact
                            email={resolvedResume.email}
                            website={resolvedResume.url}
                            location={`${resolvedResume.locationCity}, ${resolvedResume.locationCountryCode}`}
                            github={resolvedResume.profiles.find((p: Profile) => p.network === 'GitHub')?.url}
                            linkedin={resolvedResume.profiles.find((p: Profile) => p.network === 'LinkedIn')?.url}
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
                    {/* About Me and Clifton Strengths Row */}
                    <div className="grid grid-cols-[1fr,180px] gap-8 mb-8">
                        {resolvedResume.summary && (
                            <section>
                                <Line />
                                <h2 className="text-sm font-semibold text-zinc-800 mb-4 uppercase">
                                    About me
                                </h2>
                                <div className="text-zinc-600 text-xs leading-relaxed">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: resolvedResume.summary
                                        }}
                                    />
                                </div>
                            </section>
                        )}

                        <section>
                            <Line />
                            <h2 className="text-sm font-semibold text-zinc-800 mb-4 uppercase">
                                Clifton Strengths
                            </h2>
                            <div className="space-y-4">
                                {resolvedResume.clifton_strengths?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {resolvedResume.clifton_strengths.map((strength: string, i: number) => (
                                            <span key={i} className="inline-block px-2 py-1 text-xs bg-zinc-100 text-zinc-500 rounded">
                                                {strength}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {resolvedResume.work && resolvedResume.work.length > 0 && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-sm font-semibold text-zinc-800 mb-4 uppercase">
                                Experience
                            </h2>

                            {resolvedResume.work.map((job: Resume['work'][number], index: number) => (
                                <Work key={index} job={job} />
                            ))}
                        </section>
                    )}

                    {resolvedResume.mentoring && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-sm font-semibold text-zinc-800 mb-4 uppercase">
                                Mentoring
                            </h2>
                            <h3 className="font-bold text-zinc-950 text-sm uppercase py-1">
                                {resolvedResume.mentoring.position}
                            </h3>
                            <div className='flex row justify-between mb-8'>
                                <div className="grid grid-cols-[1fr,180px] gap-6 w-full">
                                    <div>
                                        <div className='flex row justify-between mb-2'>
                                            <span className="text-zinc-500 text-xs">
                                                {resolvedResume.mentoring.name}
                                            </span>
                                            <div className="text-zinc-500 text-xs">
                                                {resolvedResume.mentoring.startDate} - Present
                                            </div>
                                        </div>
                                        <div className="text-zinc-600 text-xs leading-relaxed">
                                            <ul className="mt-2 ml-8 list-disc list-outside">
                                                {resolvedResume.mentoring.highlights.map((highlight: string, i: number) => (
                                                    <li key={i}>{highlight}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {resolvedResume.mentoring.skills && (
                                            <div className="flex flex-wrap gap-2">
                                                {resolvedResume.mentoring.skills.map((skill: string, i: number) => (
                                                    <span key={i} className="inline-block px-2 py-1 text-xs bg-zinc-50 text-zinc-500 rounded">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Hackathons Row */}
                    <div className="grid grid-cols-3 gap-8 mb-8">
                        {resolvedResume.education && resolvedResume.education.length > 0 && (
                            <section className="col-span-1">
                                <Line />
                                <h2 className="text-sm font-semibold text-zinc-800 mb-4 uppercase">
                                    Education
                                </h2>
                                <div className="text-xs">
                                    {resolvedResume.education.map((item: Education, i: number) => (
                                        <div key={i}>
                                            <h3 className="font-semibold text-zinc-800 ">{item.area}</h3>
                                            <p className="text-zinc-600 ">{item.institution} - {item.location}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        {resolvedResume.hackathons && resolvedResume.hackathons.length > 0 && (
                            <section className="col-span-2">
                                <Line />
                                <h2 className="text-sm font-semibold text-zinc-800 mb-4 uppercase">
                                    Hackathons
                                </h2>
                                <div className="space-y-4">
                                    <p className="text-zinc-600 text-xs">
                                        Spent <strong>152 hours</strong> across <strong>{resolvedResume.hackathons.length}</strong> hackathons, because nothing says "I love coding" like doing it non-stop for days.
                                    </p>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Talks Section */}
                    <section className="mb-8">
                        <Line />
                        <h2 className="text-sm font-semibold text-zinc-800 mb-4 uppercase">
                            Talks
                        </h2>
                        <div className="space-y-4">
                            {resolvedResume.talks.map((talk: Talk, i: number) => (
                                <div key={i} className="flex justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-zinc-800 text-xs">{talk.title}</h3>
                                        <p className="text-zinc-400 text-xs">
                                            {talk.conference} / {talk.place}
                                        </p>
                                    </div>
                                    <div className="text-zinc-500  text-xs text-left tabular-nums">
                                        {talk.date}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {resolvedResume.interests && resolvedResume.interests.length > 0 && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-sm font-semibold text-zinc-800 mb-4 uppercase">
                                Interests
                            </h2>
                            <div className="grid grid-rows-3 grid-flow-col gap-4">
                                {resolvedResume.interests.map((interest: string, i: number) => (
                                    <div key={i} className="text-zinc-600 text-xs">
                                        {interest}
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

function SocialProfiles({ profiles }: { profiles: Resume['profiles'] }) {
    return (
        <div className="flex flex-wrap gap-4">
            {profiles.map((profile: Profile, index: number) => (
                <a
                    key={index}
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-zinc-700"
                >
                    {profile.network}
                </a>
            ))}
        </div>
    )
}

function Education({ education }: { education: Resume['education'] }) {
    return (
        <div className="space-y-4">
            {education.map((edu: Education, index: number) => (
                <div key={index}>
                    <h3 className="font-semibold text-zinc-800 text-sm">{edu.area}</h3>
                    <p className="text-zinc-600 text-sm">{edu.institution} - {edu.location}</p>
                </div>
            ))}
        </div>
    )
}

function Interests({ interests }: { interests: Resume['interests'] }) {
    return (
        <div className="space-y-4">
            {interests.map((interest: Interest, index: number) => (
                <div key={index}>
                    <h3 className="text-sm font-medium text-zinc-700 mb-2">{interest.name}</h3>
                    <div className="space-y-2">
                        {interest.keywords.map((keyword: string, keywordIndex: number) => (
                            <div key={keywordIndex} className="text-zinc-600 text-sm">
                                {keyword}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
} 