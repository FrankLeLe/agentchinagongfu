import { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'secondme',
      name: 'SecondMe',
      type: 'oauth',
      version: '2.0',
      authorization: {
        url: process.env.SECONDME_OAUTH_URL || 'https://go.second.me/oauth/',
        params: {
          scope: 'user.info user.info.shades',
          response_type: 'code',
        },
      },
      token: {
        url: process.env.SECONDME_TOKEN_ENDPOINT || 'https://api.mindverse.com/gate/lab/api/oauth/token/code',
        params: {
          grant_type: 'authorization_code',
        },
      },
      userinfo: {
        url: process.env.SECONDME_API_BASE_URL + '/api/secondme/user/info' || 'https://api.mindverse.com/gate/lab/api/secondme/user/info',
      },
      clientId: process.env.SECONDME_CLIENT_ID,
      clientSecret: process.env.SECONDME_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.data?.userId || profile.id,
          name: profile.data?.name || profile.name,
          email: profile.data?.email || profile.email,
          image: profile.data?.avatar || profile.picture,
          secondmeUserId: profile.data?.userId || profile.id,
          secondmeRoute: profile.data?.route || '',
          bio: profile.data?.bio || profile.data?.selfIntroduction || '',
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        const p = profile as any
        token.secondmeUserId = p.secondmeUserId
        token.secondmeRoute = p.secondmeRoute
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      session.secondmeUserId = token.secondmeUserId
      session.secondmeRoute = token.secondmeRoute
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}
