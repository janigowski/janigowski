import { MDX } from 'contentlayer/core'

export interface ExperienceItem {
    period: string
    title: string
    company: string
    location: string
    description: string
}

export interface EducationItem {
    period: string
    degree: string
    school: string
    location: string
}

export interface SkillItem {
    name: string
}

export interface ReferenceItem {
    name: string
    title: string
    email: string
}

export interface Job {
    id: string
    company: string
    title: string
    period: string
    location: string
}

export interface Location {
    city: string
    countryCode: string
}

export interface Profile {
    network: string
    username?: string
    url: string
}

export interface Basics {
    name: string
    label: string
    email: string
    url: string
    summary: string
    location: Location
    profiles: Profile[]
}

export interface Work {
    name: string
    position: string
    startDate: string
    endDate?: string
    summary: string
    highlights: string[]
}

export interface Education {
    institution: string
    area: string
    location: string
}

export interface Skill {
    name: string
    keywords: string[]
}

export interface Interest {
    name: string
    keywords: string[]
}

export interface Resume {
    name: string
    label: string
    email: string
    url: string
    summary: string
    locationCity: string
    locationCountryCode: string
    profiles: Profile[]
    work: Work[]
    education: Education[]
    skills: Skill[]
    interests: Interest[]
    _id: string
    _raw: {
        sourceFilePath: string
        sourceFileName: string
        sourceFileDir: string
        contentType: string
        flattenedPath: string
    }
}

export interface ResumeExtension {
    name?: string
    label?: string
    email?: string
    url?: string
    summary?: string
    locationCity?: string
    locationCountryCode?: string
    profiles?: Profile[]
    work?: Work[]
    education?: Education[]
    skills?: Skill[]
    interests?: Interest[]
    _id: string
    _raw: {
        sourceFilePath: string
        sourceFileName: string
        sourceFileDir: string
        contentType: string
        flattenedPath: string
    }
    slug: string
    mergedResume: Resume
}

interface Position {
    title: string
    period?: string
    achievements?: string[]
    responsibilities?: string[]
    product_engineering?: string[]
    company_wide?: string[]
    technologies?: string[]
    leadership?: {
        meetings_hosted: number
        description: string
        topics: string[]
    }
    skills?: string[]
}

interface ExperienceEntry {
    company: string
    color: string
    position?: string
    period?: string
    location?: string
    description?: string
    achievements?: string[]
    impact?: string[]
    technologies?: string[]
    positions?: Position[]
}

export interface PublicSpeakingItem {
    date: string
    conference: string
    place: string
    title: string
}

export interface ContactProps {
    email: string
    website: string
    location: string
    github?: string
    linkedin?: string
}

declare module 'contentlayer/generated' {
    export const allResumes: Resume[]
    export const allResumeExtensions: ResumeExtension[]
} 