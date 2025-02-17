import { Lamp } from './types'
import { kv } from '@vercel/kv'

type StoredTokens = {
    accessToken: string
    refreshToken: string
    expiresAt: number
    username?: string
}

export class RemoteHue {
    private static instance: RemoteHue
    private accessToken: string | null = null
    private refreshToken: string | null = null
    private tokenExpiresAt: number | null = null
    private username: string | null = null
    private readonly baseUrl = 'https://api.meethue.com/route/clip/v2'
    private lastRequestTime: { [key: string]: number } = {}
    private readonly throttleInterval = 250 // milliseconds between requests

    private constructor() { }

    static getInstance(): RemoteHue {
        if (!RemoteHue.instance) {
            RemoteHue.instance = new RemoteHue()
        }
        return RemoteHue.instance
    }

    private async loadTokens() {
        try {
            const tokens = await kv.get<StoredTokens>('hue_tokens')
            if (tokens && 'accessToken' in tokens) {
                this.accessToken = tokens.accessToken
                this.refreshToken = tokens.refreshToken
                this.tokenExpiresAt = tokens.expiresAt
                this.username = tokens.username || null
                return
            }
        } catch (error) {
            console.warn('Failed to load tokens from KV')
        }

        const { HUE_ACCESS_TOKEN, HUE_REFRESH_TOKEN, HUE_TOKEN_EXPIRES_AT, HUE_USERNAME } = process.env
        if (HUE_ACCESS_TOKEN && HUE_REFRESH_TOKEN && HUE_TOKEN_EXPIRES_AT) {
            this.accessToken = HUE_ACCESS_TOKEN
            this.refreshToken = HUE_REFRESH_TOKEN
            this.tokenExpiresAt = parseInt(HUE_TOKEN_EXPIRES_AT)
            this.username = HUE_USERNAME || null
        }
    }

    async setTokens(accessToken: string, refreshToken: string, expiresIn: number) {
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        this.tokenExpiresAt = Date.now() + expiresIn * 1000

        try {
            await kv.set('hue_tokens', {
                accessToken,
                refreshToken,
                expiresAt: this.tokenExpiresAt,
                username: this.username
            })
        } catch (error) {
            console.warn('Failed to save tokens to KV')
        }
    }

    private async getUsername() {
        if (this.username) {
            return this.username
        }

        const linkResponse = await fetch('https://api.meethue.com/route/api/0/config', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ linkbutton: true })
        })

        if (!linkResponse.ok) {
            throw new Error('Failed to enable linkbutton')
        }

        const response = await fetch('https://api.meethue.com/route/api', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                devicetype: 'janigowski#website'
            })
        })

        if (!response.ok) {
            throw new Error('Failed to get username')
        }

        const data = await response.json()
        const username = data[0]?.success?.username

        if (!username) {
            throw new Error('No username in response')
        }

        this.username = username

        try {
            const tokens = await kv.get<StoredTokens>('hue_tokens')
            if (tokens) {
                await kv.set('hue_tokens', {
                    ...tokens,
                    username
                })
            }
        } catch (error) {
            console.warn('Failed to save username to KV')
        }

        return username
    }

    private async refreshTokenIfNeeded() {
        if (!this.tokenExpiresAt || !this.refreshToken) {
            throw new Error('No refresh token available')
        }

        if (this.tokenExpiresAt - Date.now() > 5 * 60 * 1000) {
            return
        }

        const { HUE_CLIENT_ID: clientId, HUE_CLIENT_SECRET: clientSecret } = process.env
        if (!clientId || !clientSecret) {
            throw new Error('Missing HUE_CLIENT_ID or HUE_CLIENT_SECRET')
        }

        const response = await fetch('https://api.meethue.com/v2/oauth2/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: this.refreshToken
            })
        })

        if (!response.ok) {
            throw new Error('Failed to refresh token')
        }

        const data = await response.json()
        await this.setTokens(data.access_token, data.refresh_token, data.expires_in)
    }

    private async fetch(endpoint: string, options: RequestInit = {}) {
        await this.loadTokens()
        await this.refreshTokenIfNeeded()

        if (!this.accessToken) {
            throw new Error('Not authenticated')
        }

        const username = await this.getUsername()

        // Throttle requests to the same endpoint
        const now = Date.now()
        const lastRequest = this.lastRequestTime[endpoint] || 0
        const timeSinceLastRequest = now - lastRequest

        if (timeSinceLastRequest < this.throttleInterval) {
            // Skip this request if it's too soon
            throw new Error('Rate limited: Too many requests to the same endpoint')
        }

        const url = `${this.baseUrl}/${endpoint}`
        const requestParams = {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'hue-application-key': username,
                'Content-Type': 'application/json'
            }
        }

        this.lastRequestTime[endpoint] = now
        const response = await fetch(url, requestParams)

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Hue API error: ${response.status} ${errorText}`)
        }

        if (response.status === 204) {
            return null
        }

        const data = await response.json()
        return data
    }

    async getLights(): Promise<Lamp[]> {
        const response = await this.fetch('resource/light')
        return response?.data || []
    }

    async toggleLight(id: string, on: boolean) {
        await this.fetch(`resource/light/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ on: { on } })
        })
    }

    async setColor(id: string, hexColor: string) {
        const xy = this.hexToXY(hexColor)
        await this.fetch(`resource/light/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ color: { xy } })
        })
    }

    async setBrightness(id: string, brightness: number) {
        await this.fetch(`resource/light/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ dimming: { brightness } })
        })
    }

    private hexToXY(hex: string): { x: number, y: number } {
        // Remove the hash if present
        hex = hex.replace('#', '')

        // Convert hex to RGB
        const r = parseInt(hex.substring(0, 2), 16) / 255
        const g = parseInt(hex.substring(2, 4), 16) / 255
        const b = parseInt(hex.substring(4, 6), 16) / 255

        // Convert RGB to XY using Philips Hue formula
        // Source: https://developers.meethue.com/develop/application-design-guidance/color-conversion-formulas-rgb-to-xy-and-back/
        const red = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
        const green = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
        const blue = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92

        const X = red * 0.664511 + green * 0.154324 + blue * 0.162028
        const Y = red * 0.283881 + green * 0.668433 + blue * 0.047685
        const Z = red * 0.000088 + green * 0.072310 + blue * 0.986039

        const sum = X + Y + Z

        if (sum === 0) {
            return { x: 0, y: 0 }
        }

        return {
            x: Number((X / sum).toFixed(4)),
            y: Number((Y / sum).toFixed(4))
        }
    }
}

export const remoteHue = RemoteHue.getInstance()