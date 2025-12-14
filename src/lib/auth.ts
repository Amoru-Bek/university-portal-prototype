
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode('my-secret-key')


export interface SessionUser {
    id: string
    email: string
    role: string
    name: string
    facultyId?: string
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    if (!session) return null
    try {
        const { payload } = await jwtVerify(session, secret, { algorithms: ['HS256'] })
        return { user: payload as unknown as SessionUser }
    } catch (error) {
        return null
    }
}

export async function login(userData: any) {
    const cookieStore = await cookies()
    if (!userData) {
        cookieStore.delete('session')
        return
    }

    const session = await new SignJWT(userData)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(secret)

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    })
}
