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
    level: number
}

export interface ReferenceItem {
    name: string
    title: string
    phone: string
    email: string
}

export interface ResumeSection {
    title: string
    type: 'about' | 'experience' | 'education' | 'expertise' | 'reference'
    content?: string
    items?: ExperienceItem[] | EducationItem[] | SkillItem[] | ReferenceItem[]
}

export interface Resume {
    title: string
    firstName: string
    lastName: string
    position: string
    contact: {
        phone: string
        email: string
        website: string
        location: string
    }
    sections: ResumeSection[]
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