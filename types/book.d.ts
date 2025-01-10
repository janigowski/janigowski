declare module "@/.contentlayer/generated" {
    export type Book = {
        title: string;
        author: string;
        published: boolean;
        status: 'read' | 'reading' | 'waiting' | 'listened' | 'listening';
        bookType: 'paper' | 'audiobook' | 'ebook';
        tag: string;
        date?: string;
        cover: string;
        body: {
            raw: string;
            code: string;
        };
        slug: string;
    };

    export const allBooks: Book[];
} 