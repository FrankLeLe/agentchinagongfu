import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

console.log('[NextAuth] Creating handler with options:', {
  providers: authOptions.providers.map(p => ({
    id: p.id,
    type: p.type,
    clientId: p.clientId ? 'set' : 'missing',
    clientSecret: p.clientSecret ? 'set' : 'missing',
    authorization: typeof p.authorization === 'string' ? p.authorization.substring(0, 80) + '...' : 'object',
  })),
  debug: authOptions.debug,
})

const handler = NextAuth(authOptions)

console.log('[NextAuth] Handler created successfully')

export { handler as GET, handler as POST }
