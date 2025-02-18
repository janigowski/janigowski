import { NextResponse } from 'next/server'
import { getRedirectUri } from '@/services/hue/auth'

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