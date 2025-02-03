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

export interface Resume {
    title: string
    role: string
    about: string
    experience: {
        [key: string]: string  // Maps job ID to MDX content
    }
    published: boolean
    date: string
    body: {
        code: string
    }
    slug: string
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

export interface Profile {
    metadata: {
        version: string
        last_updated: string
        template: string
    }
    personal: {
        name: string
        title: string
        email: string
        website: string
        location: string
        github: string
        linkedin: string
    }
    experience: ExperienceEntry[]
    skills: {
        technical: string[]
        applications: string[]
    }
    education: EducationItem[]
    public_speaking: PublicSpeakingItem[]
    interests: {
        main: string[]
        other: string[]
    }
    highlights: {
        experience_years: string
        products_contributed: string
        mentees_guided: string
        countries_impacted: string
    }
}

export interface PublicSpeakingItem {
    date: string
    conference: string
    place: string
    title: string
}

declare module 'contentlayer/generated' {
    export const allResumes: Resume[]
    export const allProfiles: Profile[]
} 