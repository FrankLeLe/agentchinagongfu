import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    refreshToken?: string
    secondmeUserId?: string
    secondmeRoute?: string
    user: {
      secondmeUserId?: string
      secondmeRoute?: string
      bio?: string
    } & DefaultSession['user']
  }

  interface User {
    secondmeUserId?: string
    secondmeRoute?: string
    bio?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    secondmeUserId?: string
    secondmeRoute?: string
  }
}
