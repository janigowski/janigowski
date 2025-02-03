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
    technologies?: string[]
}

export interface Education {
    institution: string
    area: string
    location: string
}

export interface Interest {
    name: string
    keywords: string[]
}

export interface Presentation {
    date: string
    conference: string
    place: string
    title: string
}

export interface HackathonEntry {
    name: string
    achievement?: string
}

export interface Volunteer {
    organization: string
    position: string
    startDate?: string
    endDate?: string
    summary?: string
    highlights: Presentation[] | HackathonEntry[]
}

export interface Mentoring extends Work {
    impact?: string[]
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
    experience_years: string
    products_contributed: string
    clifton_strengths: string[]
    mindset: string[]
    mentoring: Mentoring
    work: Work[]
    education: Education[]
    interests: Interest[]
    volunteer: Volunteer[]
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
    slug: string
    mergedResume: Resume
    _id: string
    _raw: {
        sourceFilePath: string
        sourceFileName: string
        sourceFileDir: string
        contentType: string
        flattenedPath: string
    }
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

export interface General {
    slug: string
    resume: Resume
    _id: string
    _raw: {
        sourceFilePath: string
        sourceFileName: string
        sourceFileDir: string
        contentType: string
        flattenedPath: string
    }
}

declare module 'contentlayer/generated' {
    export const allResumes: Resume[]
    export const allResumeExtensions: ResumeExtension[]
    export const allGenerals: General[]
} 