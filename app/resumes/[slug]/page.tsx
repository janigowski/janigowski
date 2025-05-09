import { notFound } from 'next/navigation'
import { allResumes, Resume } from 'contentlayer/generated'
import type { Metadata } from 'next'
import Image from 'next/image'
import Line from './Line'
import Contact from './Contact'
import Work from './Work'

type Profile = Resume['profiles'][number]
type Education = Resume['education'][number]
type Interest = Resume['interests'][number]

interface ResumePageProps {
    params: {
        slug: string
    }
}

function sanitizeTitle(text: string): string {
    // Remove HTML tags, normalize whitespace, and remove special characters
    return text
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&[^;]+;/g, '') // Remove HTML entities
        .replace(/[\r\n\t]+/g, ' ') // Replace newlines and tabs with spaces
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
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
    const sanitizedName = sanitizeTitle(resolvedResume.name)
    const sanitizedRole = sanitizeTitle(resolvedResume.role)

    return {
        title: `${sanitizedName} - ${sanitizedRole}`,
        description: resolvedResume.summary
    }
}

export default function ResumePage({ params }: ResumePageProps) {
    const resume = allResumes.find((r) => r.slug === params.slug)

    if (!resume) {
        notFound()
    }

    const resolvedResume = resume.resolvedResume

    const [firstName, lastName] = resolvedResume.name.split(' ')

    return (
        <div className="relative min-h-screen">
            <article className="mx-auto bg-white">
                {/* Header Section */}
                <header className="relative mb-8 print:break-inside-avoid">
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
                    <div className="grid grid-cols-[1fr,180px] gap-8 mb-4">
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
                                <div key={index} className='mb-8'>
                                    <Work job={job} />
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Education, Interests and Certifications Row */}
                    <div className="grid grid-cols-[47%_53%] gap-8">
                        <div className="space-y-8">
                            {resolvedResume.education && resolvedResume.education.length > 0 && (
                                <section>
                                    <Line />
                                    <h2 className="text-sm font-semibold text-zinc-800 mb-4 uppercase">
                                        Education
                                    </h2>
                                    <div className="text-xs">
                                        {resolvedResume.education.map((item: Education, i: number) => (
                                            <div key={i} className='space-y-2'>
                                                <h3 className="font-semibold text-zinc-800 ">{item.area}</h3>
                                                <p className="text-zinc-500 ">{item.institution} {item.location}</p>
                                                <p className="text-zinc-400 ">{item.year}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                            {resolvedResume.interests && resolvedResume.interests.length > 0 && (
                                <section>
                                    <Line />
                                    <h2 className="text-sm font-semibold text-zinc-800 mb-4 uppercase">
                                        Interests
                                    </h2>
                                    <div className="grid grid-cols-2 gap-2">
                                        {resolvedResume.interests.map((interest: string, i: number) => (
                                            <div key={i} className="text-zinc-600 text-xs">
                                                {interest}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                        {resolvedResume.courses && resolvedResume.courses.length > 0 && (
                            <section>
                                <Line />
                                <h2 className="text-sm font-semibold text-zinc-800 mb-4 uppercase">
                                    Courses
                                </h2>
                                <ul className="list-disc list-outside ml-6 space-y-2">
                                    {resolvedResume.courses.map((course: string, i: number) => (
                                        <li key={i} className="text-zinc-600 text-xs">
                                            {course}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
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