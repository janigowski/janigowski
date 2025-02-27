import { Resume } from 'contentlayer/generated'
import Company from './Company'

type Project = {
    name: string
    highlights: string[]
    summary?: string
}

type Work = Resume['work'][number] & {
    projects?: Project[]
}

const companyToColor = (name: string): { mainColor: string, textColor: string, logo: string } => {
    const companies = {
        'Netguru': {
            mainColor: '#47E071',
            textColor: '#4a4a4a',
            logo: 'netguru.jpg'
        },
        'janigowski.dev': {
            mainColor: '#BBDF32',
            textColor: '#4a4a4a',
            logo: 'janigowski.jpg'
        },
        'ThinkSmart': {
            mainColor: '#4a4a4a',
            textColor: '#fff',
            logo: 'thinksmart.jpg'
        },
        'ADPList': {
            mainColor: '#000',
            textColor: '#fff',
            logo: 'adplist.jpg'
        },
        'GetResponse': {
            mainColor: '#00BDFF',
            textColor: '#fff',
            logo: 'getresponse.jpg'
        },
    } as const

    return companies[name as keyof typeof companies] || '#4a4a4a'
}

export default function Work({ job }: { job: Work }) {
    return (
        <>
            <h3
                className="font-bold text-zinc-950 text-sm uppercase py-1"
            >
                {job.position}
            </h3>
            <div className='flex row justify-between'>
                <div className="grid grid-cols-[1fr,180px] gap-6 w-full">
                    <div>
                        <div className='flex row justify-between mb-2'>
                            {/* <Company name={job.name} /> */}
                            <span className="text-zinc-500 text-xs ">
                                {job.name}
                            </span>
                            <div className="text-zinc-500 text-xs ">
                                {job.startDate} - {job.endDate || 'Present'}
                            </div>
                        </div>
                        <div className="text-zinc-600 text-xs leading-relaxed">

                            <ul className="mt-2 ml-8 list-disc list-outside">
                                {job.highlights.map((highlight: string, i: number) => (
                                    <li key={i} dangerouslySetInnerHTML={{
                                        __html: highlight
                                    }} />
                                ))}
                            </ul>

                            {job.projects && job.projects.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="font-medium text-zinc-600 mb-2">Projects</h4>
                                    <div className='space-y-1'>
                                        {job.projects.map((project: Project, index: number) => (
                                            <div key={index}>
                                                <h5 className="text-zinc-700 ml-4">
                                                    <span className="italic">{project.name}</span> {project.summary ?
                                                        <span className="text-zinc-500 text-xs">: {project.summary}</span>
                                                        : ''
                                                    }</h5>
                                                {project.highlights && project.highlights.length > 0 && (
                                                    <ul className="mt-1 mb-4 ml-8 list-disc list-outside">
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
                {/* <div
                    className="self-stretch w-px"
                    style={{ backgroundColor: companyToColor(job.name).mainColor }}
                >
                </div> */}
            </div>
        </>
    )
} 