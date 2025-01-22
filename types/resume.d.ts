import { MDX } from 'contentlayer/core'

export interface ResumeSection {
    title: string
    content: string
}

export interface Resume {
    title: string
    date?: string
    sections: ResumeSection[]
    published?: boolean
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