import { Resume } from 'contentlayer/generated'
import Company from './Company'

type Project = {
    name: string
    highlights: string[]
}

type Work = Resume['work'][number] & {
    projects?: Project[]
}

const companyToColor = (name: string): string => {
    const companies = {
        'Netguru': '#47E071',
        'janigowski.dev': '#BBDF32',
        'ThinkSmart': '#4a4a4a',
        'ADPList': '#000',
        'GetResponse': '#00BDFF',
    } as const

    return companies[name as keyof typeof companies] || '#4a4a4a'
}

export default function Work({ job }: { job: Work }) {
    return (
        <div className="grid grid-cols-[1fr,180px] gap-6">
            <div>
                <div className='flex row justify-between mb-2'>
                    <h3
                        className="font-normal text-zinc-800 text-xs uppercase"
                        style={{ borderBottom: `1px solid ${companyToColor(job.name)}` }}
                    >
                        {job.position}
                    </h3>
                    <div className='flex row text-xs'>
                        <Company name={job.name} />
                    </div>
                </div>
                <div className="text-zinc-600 text-xs leading-relaxed">
                    <p>{job.summary}</p>
                    <ul className="mt-2 ml-8 list-disc list-outside">
                        {job.highlights.map((highlight: string, i: number) => (
                            <li key={i} dangerouslySetInnerHTML={{
                                __html: highlight
                            }} />
                        ))}
                    </ul>
                    {job.projects && job.projects.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-medium text-zinc-800">Projects</h4>
                            <div className="space-y-4">
                                {job.projects.map((project: Project, index: number) => (
                                    <div key={index}>
                                        <h5 className="font-medium text-zinc-700 ml-4">{project.name}</h5>
                                        {project.highlights && project.highlights.length > 0 && (
                                            <ul className="mt-2 ml-8 list-disc list-outside">
                                                {project.highlights.map((highlight: string, i: number) => (
                                                    <li key={i} dangerouslySetInnerHTML={{
                                                        __html: highlight
                                                    }} />
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-4">
                <div className="text-zinc-500 text-xs">
                    {job.startDate} - {job.endDate || 'Present'}
                </div>
                {job.skills && (
                    <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill: string, i: number) => (
                            <span key={i} className="inline-block px-2 py-1 text-xs bg-zinc-50 text-zinc-500 rounded">
                                {skill}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
} 