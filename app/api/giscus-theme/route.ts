import { readFileSync } from 'fs'
import { NextResponse } from 'next/server'
import path from 'path'

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'public', 'giscus-theme.css')
        const cssContent = readFileSync(filePath, 'utf8')

        return new NextResponse(cssContent, {
            headers: {
                'Content-Type': 'text/css',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        })
    } catch (error) {
        return new NextResponse('Error loading theme', { status: 500 })
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    })
} 