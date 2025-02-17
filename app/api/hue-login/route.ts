import { NextResponse } from 'next/server'

function getRedirectUri() {
    const host = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.HOST

    if (!host) {
        throw new Error('Missing HOST environment variable. Please add it to your .env file (e.g. HOST=http://localhost:3000)')
    }

    return `${host}/api/hue-authorize`
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