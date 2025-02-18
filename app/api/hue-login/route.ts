import { NextResponse } from 'next/server'

function getRedirectUri() {
    const hosts = {
        production: 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL,
        preview: 'https://' + process.env.VERCEL_BRANCH_URL,
        development: process.env.HOST
    }

    const url = hosts[process.env.VERCEL_ENV as keyof typeof hosts] || process.env.HOST

    if (!url) {
        throw new Error('Missing host configuration. Please check environment variables for your environment:\n' +
            '- Production: VERCEL_PROJECT_PRODUCTION_URL\n' +
            '- Preview: VERCEL_BRANCH_URL\n' +
            '- Development: HOST (e.g. HOST=http://localhost:3000)')
    }

    return url + '/api/hue-authorize'
}

export async function GET() {
    const clientId = process.env.HUE_CLIENT_ID
    if (!clientId) {
        return new NextResponse('Missing HUE_CLIENT_ID', { status: 500 })
    }

    const redirectUri = getRedirectUri()
    const state = Math.random().toString(36).substring(7)

    const authUrl = `https://api.meethue.com/v2/oauth2/authorize?client_id=${clientId}&response_type=code&state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}`

    return NextResponse.redirect(authUrl)
} 