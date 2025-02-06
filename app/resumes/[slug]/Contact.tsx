import { Mail, Globe, MapPin, Github, Linkedin } from 'lucide-react'
import Link from 'next/link'

type ContactProps = {
    email: string
    website: string
    location: string
    github?: string
    linkedin?: string
}

const itemClassName = 'flex items-center justify-start gap-4'

export default function Contact({ email, website, location, github, linkedin }: ContactProps) {
    return (
        <div className="self-stretch flex flex-col justify-between text-right text-xs text-zinc-400 w-[180px]">
            {linkedin && (
                <Link href={linkedin} target="_blank" rel="noopener noreferrer" className={itemClassName}>
                    <Linkedin className="w-4 h-4" />
                    <span>{linkedin.split('/').pop()}</span>
                </Link>
            )}
            <Link href={website} target="_blank" rel="noopener noreferrer" className={itemClassName}>
                <Globe className="w-4 h-4" />
                <span>{website.replace('https://', '')}</span>
            </Link>
            <Link href={`mailto:${email}`} className={itemClassName}>
                <Mail className="w-4 h-4" />
                <span>{email}</span>
            </Link>
            {github && (
                <Link href={github} target="_blank" rel="noopener noreferrer" className={itemClassName}>
                    <Github className="w-4 h-4" />
                    <span>{github.split('/').pop()}</span>
                </Link>
            )}
            <div className={itemClassName}>
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
            </div>
        </div>
    )
} 