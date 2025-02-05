import { Resume } from 'contentlayer/generated'
import Company from './Company'

type Work = Resume['work'][number] & {
    projects?: string[]
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
                        className="font-normal text-zinc-800 text-sm uppercase"
                        style={{ borderBottom: `1px solid ${companyToColor(job.name)}` }}
                    >
                        {job.position}
                    </h3>
                    <div className='flex row text-sm'>
                        <Company name={job.name} />
                    </div>
                </div>
                <div className="text-zinc-600 text-sm leading-relaxed">
                    <p>{job.summary}</p>
                    <ul className="mt-2 list-disc list-inside">
                        {job.highlights.map((highlight: string, i: number) => (
                            <li key={i}>{highlight}</li>
                        ))}
                    </ul>
                    {job.projects && job.projects.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-medium text-zinc-800 mb-2">Projects</h4>
                            <ul className="list-disc list-inside">
                                {job.projects.map((project: string, index: number) => (
                                    <li key={index}>{project}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-4">
                <div className="text-zinc-500 text-sm">
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