import { NextResponse } from "next/server"
import { remoteHue } from "@/services/remoteHue"

function getRedirectUri() {
    const host = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.HOST

    if (!host) {
        throw new Error('Missing HOST environment variable. Please add it to your .env file (e.g. HOST=http://localhost:3000)')
    }

    return host + '/api/hue-authorize'
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url)
        const code = url.searchParams.get('code')

        if (!code) {
            return new NextResponse('No code provided', { status: 400 })
        }

        const token = await exchangeCodeForToken(code)

        await remoteHue.setTokens(token.access_token, token.refresh_token, token.expires_in)

        return new NextResponse(`
            <html>
                <body style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem;">
                    <h1>Authorization Successful!</h1>
                    <p>Your Philips Hue lights are now connected to your portfolio.</p>
                    <p>
                        <a 
                            href="/lamp"
                            style="display: inline-block; background: #3b82f6; color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 0.25rem; margin-top: 1rem;"
                        >
                            Go to Lamp Controls
                        </a>
                    </p>
                    ${process.env.NODE_ENV === 'development' ? `
                        <div style="margin-top: 2rem; padding: 1rem; background: #f0f0f0; border-radius: 4px;">
                            <p><strong>Development Mode:</strong> Add these values to your .env.local file:</p>
                            <pre style="overflow-x: auto;">
HUE_ACCESS_TOKEN=${token.access_token}
HUE_REFRESH_TOKEN=${token.refresh_token}
HUE_TOKEN_EXPIRES_AT=${Date.now() + token.expires_in * 1000}
                            </pre>
                        </div>
                    ` : ''}
                </body>
            </html>
        `, {
            headers: {
                'Content-Type': 'text/html'
            }
        })
    } catch (error) {
        console.error('Hue authorization error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Error during authorization'
        return new NextResponse(errorMessage, { status: 500 })
    }
}

async function exchangeCodeForToken(code: string) {
    const clientId = process.env.HUE_CLIENT_ID
    const clientSecret = process.env.HUE_CLIENT_SECRET
    const redirectUri = getRedirectUri()

    if (!clientId || !clientSecret) {
        throw new Error('Missing HUE_CLIENT_ID or HUE_CLIENT_SECRET environment variables')
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    const response = await fetch('https://api.meethue.com/v2/oauth2/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri
        })
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to exchange code for token: ${error}`)
    }

    return response.json()
}