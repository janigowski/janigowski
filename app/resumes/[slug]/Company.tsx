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

export default function Company({ name }: CompanyProps) {
    const company = companies[name as keyof typeof companies]

    if (!company) {
        return <span className="text-zinc-600">{name}</span>
    }

    return (
        <div className="flex items-center  text-center w-36 px-2" style={{ color: company.textColor, backgroundColor: company.mainColor }}>

            <div className="relative w-4 h-4">
                <Image
                    src={`/companies/${company.logo}`}
                    alt={`${name} logo`}
                    width={32}
                    height={32}
                    className="object-contain"
                />
            </div>
            <span className='flex-1'>
                {name}
            </span>
        </div>
    )
} 