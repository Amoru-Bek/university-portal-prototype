'use server'

import { PrismaClient } from '@prisma/client'
import { login } from '@/lib/auth'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export async function authenticate(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Please enter both email and password' }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        })

        if (!user || user.password !== password) {
            return { error: 'Invalid credentials' }
        }

        // Create session
        await login({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            facultyId: user.facultyId
        })

        // Redirect based on role
        if (user.role === 'ADMIN') {
            redirect('/admin/dashboard')
        } else {
            redirect('/student/dashboard')
        }

    } catch (error) {
        if ((error as any).message === 'NEXT_REDIRECT') {
            throw error
        }
        console.error(error)
        return { error: 'Authentication failed' }
    }
}

export async function logout() {
    await login(null)
    redirect('/')
}
