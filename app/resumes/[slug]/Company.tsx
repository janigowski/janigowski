import Image from 'next/image'

interface CompanyProps {
    name: string
}

const companies = {
    'Netguru': {
        mainColor: '#47E071',
        textColor: '#4a4a4a',
        logo: 'netguru.jpg'
    },
    'Janigowski': {
        mainColor: '#BBDF32',
        textColor: '#4a4a4a',
        logo: 'janigowski.jpg'
    },
    'ThinkSmart': {
        mainColor: '#fff',
        textColor: '#4a4a4a',
        logo: 'thinksmart.jpg'
    },
    'ADPList': {
        mainColor: '#fff',
        textColor: '#4a4a4a',
        logo: 'adplist.jpg'
    },
    'GetResponse': {
        mainColor: '#00BDFF',
        textColor: '#fff',
        logo: 'getresponse.jpg'
    },
} as const

export default function Company({ name }: CompanyProps) {
    const company = companies[name as keyof typeof companies]

    if (!company) {
        return <span className="text-zinc-600">{name}</span>
    }

    return (
        <div className="inline-flex items-center gap-2">
            <div className="relative w-4 h-4">
                <Image
                    src={`/companies/${company.logo}`}
                    alt={`${name} logo`}
                    width={16}
                    height={16}
                    className="object-contain"
                />
            </div>
            <span style={{ color: company.textColor }}>{name}</span>
        </div>
    )
} 