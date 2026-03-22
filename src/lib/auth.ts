import { NextAuthOptions } from 'next-auth'

// SecondMe 官方推荐配置
const oauthUrl = process.env.SECONDME_OAUTH_URL || 'https://go.second.me/oauth/'
const clientId = process.env.SECONDME_CLIENT_ID
const clientSecret = process.env.SECONDME_CLIENT_SECRET
const redirectUri = process.env.SECONDME_REDIRECT_URI
const apiBaseUrl = process.env.SECONDME_API_BASE_URL || 'https://api.mindverse.com/gate/lab'

console.log('===== SecondMe OAuth Configuration =====')
console.log('oauthUrl:', oauthUrl)
console.log('clientId:', clientId ? `${clientId.substring(0,8)}...` : 'MISSING')
console.log('clientSecret:', clientSecret ? 'set' : 'MISSING')
console.log('redirectUri:', redirectUri)
console.log('apiBaseUrl:', apiBaseUrl)
console.log('========================================')

if (!clientId || !clientSecret || !redirectUri) {
  console.error('❌ Missing OAuth configuration!')
  throw new Error('OAuth configuration incomplete')
}

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'secondme',
      name: 'SecondMe',
      type: 'oauth',
      clientId: clientId!,
      clientSecret: clientSecret!,
      authorization: `${oauthUrl.replace(/\/$/, '')}?scope=${encodeURIComponent('user.info user.info.shades')}`,
      token: `${apiBaseUrl}/api/oauth/token/code`,
      userinfo: `${apiBaseUrl}/api/secondme/user/info`,
      profile(profile) {
        // SecondMe 返回格式：{ code: 0, data: { userId, name, email, avatar, ... } }
        console.log('OAuth profile received:', JSON.stringify(profile, null, 2))
        const userData = profile.data || profile
        return {
          id: userData.userId || profile.id,
          name: userData.name || profile.name,
          email: userData.email || profile.email,
          image: userData.avatar || profile.picture,
          secondmeUserId: userData.userId || profile.id,
          secondmeRoute: userData.route || '',
          bio: userData.bio || userData.selfIntroduction || '',
        }
      },
    },
  ],
  // 配置 Cookie 以支持 localhost 开发
  cookies: {
    state: {
      name: `next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false,
      },
    },
    pkceCodeVerifier: {
      name: `next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false,
        maxAge: 60 * 15, // 15 minutes
      },
    },
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
      }
      if (profile) {
        token.secondmeUserId = (profile as any).secondmeUserId
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.user.secondmeUserId = token.secondmeUserId
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}
