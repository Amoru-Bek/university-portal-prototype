'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { authenticate } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="btn-primary" disabled={pending} style={{ width: '100%' }}>
      {pending ? 'جاري التسجيل...' : 'تسجيل الدخول'}
    </button>
  )
}

export default function LoginPage() {
  const [state, formAction] = useActionState(authenticate, null)

  return (
    <main style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #fef2f2 100%)' // Subtle Green to Red gradient
    }}>
      <div className="glass-panel" style={{
        maxWidth: '430px',
        width: '100%',
        padding: '2.5rem',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.9)', // Higher opacity for "card" feel
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.05)', // Crisp edges
        borderRadius: '24px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
          <img
            src="/logo.jpg"
            alt="UnivPortal Logo"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              objectFit: 'cover',
              marginTop: '10px'
            }}
          />
          <h1 className="text-gradient" style={{ fontSize: '2rem' }}>بوابة الطالب</h1>
        </div>
        <p style={{ color: 'rgba(0,0,0,0.6)', marginBottom: '30px' }}>
          الوصول إلى مستنداتك وطلباتك
        </p>

        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'rgba(0,0,0,0.8)' }}>
              البريد الإلكتروني
            </label>
            <input
              name="email"
              type="email"
              required
              className="premium-input"
              placeholder="مثال: student@univ.com"
            />
          </div>

          <div style={{ textAlign: 'right' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'rgba(0,0,0,0.8)' }}>
              كلمة المرور
            </label>
            <input
              name="password"
              type="password"
              required
              className="premium-input"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: 'var(--danger)',
              padding: '10px',
              borderRadius: '6px',
              fontSize: '0.9rem'
            }}>
              {state.error}
            </div>
          )}

          <SubmitButton />
        </form>

        <div style={{ marginTop: '20px', fontSize: '0.8rem', color: 'rgba(0,0,0,0.4)' }}>
          نظام إدارة الوثائق الجامعية
        </div>
      </div>
    </main>
  )
}
