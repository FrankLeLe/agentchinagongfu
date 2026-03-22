import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    clientId: process.env.SECONDME_CLIENT_ID ? 'set' : 'missing',
    clientSecret: process.env.SECONDME_CLIENT_SECRET ? 'set' : 'missing',
    redirectUri: process.env.SECONDME_REDIRECT_URI || 'missing',
    oauthUrl: process.env.SECONDME_OAUTH_URL || 'default',
    tokenEndpoint: process.env.SECONDME_TOKEN_ENDPOINT || 'default',
    apiBaseUrl: process.env.SECONDME_API_BASE_URL || 'missing',
    nextauthUrl: process.env.NEXTAUTH_URL || 'missing',
  })
}
