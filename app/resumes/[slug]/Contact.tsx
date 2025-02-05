import { Mail, Globe, MapPin, Github, Linkedin } from 'lucide-react'
import Link from 'next/link'

type ContactProps = {
    email: string
    website: string
    location: string
    github?: string
    linkedin?: string
}

export default function Contact({ email, website, location, github, linkedin }: ContactProps) {
    return (
        <div className="text-right text-sm text-zinc-400 space-y-0.5 w-[180px]">
            {linkedin && (
                <Link href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-start gap-2 hover:text-zinc-200 transition-colors">
                    <Linkedin className="w-4 h-4" />
                    <span>{linkedin.split('/').pop()}</span>
                </Link>
            )}
            <Link href={website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-start gap-2 hover:text-zinc-200 transition-colors">
                <Globe className="w-4 h-4" />
                <span>{website.replace('https://', '')}</span>
            </Link>
            <Link href={`mailto:${email}`} className="flex items-center justify-start gap-2 hover:text-zinc-200 transition-colors">
                <Mail className="w-4 h-4" />
                <span>{email}</span>
            </Link>
            {github && (
                <Link href={github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-start gap-2 hover:text-zinc-200 transition-colors">
                    <Github className="w-4 h-4" />
                    <span>{github.split('/').pop()}</span>
                </Link>
            )}
            <div className="flex items-center justify-start gap-2">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
            </div>
        </div>
    )
} 