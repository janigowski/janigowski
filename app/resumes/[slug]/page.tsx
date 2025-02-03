import { notFound } from 'next/navigation'
import { allResumes, allProfiles } from 'contentlayer/generated'
import { getMDXComponent } from 'next-contentlayer/hooks'
import { Metadata } from 'next'
import { Resume, Job, EducationItem, PublicSpeakingItem } from '../../../types/resume'
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
    const profile = allProfiles[0] // There should be only one profile

    if (!resume || !profile) {
        notFound()
    }

    // Split name into first and last name
    const [firstName, lastName] = profile.personal.name.split(' ')

    // Extract jobs from experience data
    const jobs = profile.experience.flatMap((exp: any) => {
        if (exp.positions) {
            return exp.positions.map((pos: any) => ({
                id: pos.id,
                company: exp.company,
                title: pos.title,
                period: pos.period,
                location: exp.location || 'Remote',
            }));
        }
        return [{
            id: exp.id,
            company: exp.company,
            title: exp.position,
            period: exp.period,
            location: exp.location || 'Remote',
        }];
    });

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
                            <h1 className="text-5xl font-bold tracking-tight text-white font-display">{firstName} {lastName}</h1>
                            <h2 className="mt-4 font-mono text-zinc-200">{resume.role}</h2>
                        </div>
                        <Contact
                            email={profile.personal.email}
                            website={profile.personal.website}
                            location={profile.personal.location}
                            github={profile.personal.github}
                            linkedin={profile.personal.linkedin}
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

                    {jobs.length > 0 && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                Experience
                            </h2>
                            <div className="space-y-6">
                                {jobs.map((job: Job) => {
                                    const experienceContent = resume.experience[job.id];
                                    if (!experienceContent) return null;

                                    const [description, ...bullets] = experienceContent
                                        .split('\n')
                                        .map(line => line.trim())
                                        .filter(Boolean);

                                    return (
                                        <div key={job.id} className="grid grid-cols-[120px,1fr] gap-6">
                                            <div className="text-zinc-500 text-sm">{job.period}</div>
                                            <div>
                                                <div className='flex row justify-between mb-2'>
                                                    <h3 className="font-normal text-zinc-800 text-sm uppercase">{job.title}</h3>
                                                    <div className='flex row text-sm'>
                                                        <Company name={job.company} />
                                                        <span className="text-zinc-400 w-6 text-center">//</span>
                                                        <span className="text-zinc-500">{job.location}</span>
                                                    </div>
                                                </div>
                                                <div className="text-zinc-600 text-sm leading-relaxed">
                                                    <p>{description}</p>
                                                    <ul className="mt-2 list-disc list-inside">
                                                        {bullets.map((bullet, index) => (
                                                            <li key={index}>
                                                                {bullet.replace(/^-\s*/, '')}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {profile.education && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                Education
                            </h2>
                            <div className="space-y-6">
                                {profile.education.map((item: EducationItem, i: number) => (
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

                    {profile.skills && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                Technical Skills
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {profile.skills.technical.map((skill: string, i: number) => (
                                    <div key={i} className="text-zinc-600 text-sm">
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {profile.highlights && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                Leadership & Mentoring
                            </h2>
                            <div className="space-y-2">
                                <div className="text-zinc-600 text-sm">
                                    Mentored {profile.highlights.mentees_guided} developers from {profile.highlights.countries_impacted} countries
                                </div>
                                <div className="text-zinc-600 text-sm">
                                    {profile.highlights.experience_years} years of experience with {profile.highlights.products_contributed} products contributed
                                </div>
                            </div>
                        </section>
                    )}

                    {profile.public_speaking && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                Public Speaking
                            </h2>
                            <div className="space-y-4">
                                {profile.public_speaking.map((item: PublicSpeakingItem, i: number) => (
                                    <div key={i} className="text-zinc-600 text-sm">
                                        {item.conference} {item.date}: "{item.title}"
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {profile.interests && (
                        <section className="mb-8">
                            <Line />
                            <h2 className="text-base font-semibold text-zinc-800 mb-4 uppercase">
                                Interests
                            </h2>
                            <div className="space-y-2">
                                {[...profile.interests.main, ...profile.interests.other].map((item: string, i: number) => (
                                    <div key={i} className="text-zinc-600 text-sm">
                                        {item}
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