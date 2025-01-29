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

export interface Resume {
    title: string
    firstName: string
    lastName: string
    position: string
    contact: {
        email: string
        website: string
        location: string
    }
    about?: string
    experience?: ExperienceItem[]
    education?: EducationItem[]
    expertise?: string[]
    interests?: string[]
    publicSpeaking?: {
        title: string
        event: string
        year: number
    }[]
    leadershipMentoring?: string[]
    published?: boolean
    date?: string
    body: MDX
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

declare module 'contentlayer/generated' {
    export const allResumes: Resume[]
} 