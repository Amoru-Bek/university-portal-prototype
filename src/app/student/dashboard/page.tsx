import { PrismaClient, Faculty, DocumentRequest } from '@prisma/client'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

async function createRequest(formData: FormData) {
    'use server'
    const session = await getSession()
    if (!session) return

    const type = formData.get('type') as string
    const facultyId = formData.get('facultyId') as string
    const description = formData.get('description') as string

    await prisma.documentRequest.create({
        data: {
            type,
            facultyId,
            description,
            studentId: session.user.id,
            status: 'PENDING'
        }
    })

    revalidatePath('/student/dashboard')
}

export default async function StudentDashboard() {
    const session = await getSession()
    if (!session || session.user.role !== 'STUDENT') {
        redirect('/')
    }

    // Fetch data
    const faculties = await prisma.faculty.findMany()
    const requests = await prisma.documentRequest.findMany({
        where: { studentId: session.user.id },
        include: { faculty: true },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>

            {/* New Request Form */}
            <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
                <h2 style={{ marginBottom: '20px' }}>طلب جديد</h2>
                <form action={createRequest} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(0,0,0,0.7)' }}>
                            اختر الكلية
                        </label>
                        <select name="facultyId" required defaultValue="" className="premium-input" style={{ color: 'var(--foreground)', background: 'white' }}>
                            <option value="" disabled>اختر كلية...</option>
                            {faculties.map((f: Faculty) => (
                                <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(0,0,0,0.7)' }}>
                            نوع الوثيقة
                        </label>
                        <select name="type" required className="premium-input" style={{ color: 'var(--foreground)', background: 'white' }}>
                            <option value="DIPLOMA">دبلوم</option>
                            <option value="CERTIFICATE">شهادة مدرسية</option>
                            <option value="TRANSCRIPT">الابلاغ عن شكوة</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(0,0,0,0.7)' }}>
                            تفاصيل إضافية
                        </label>
                        <textarea
                            name="description"
                            className="premium-input"
                            rows={3}
                            placeholder="أي تفاصيل محددة..."
                        />
                    </div>

                    <button type="submit" className="btn-primary">إرسال الطلب</button>
                </form>
            </div>

            {/* Request History */}
            <div className="glass-panel" style={{ padding: '24px' }}>
                <h2 style={{ marginBottom: '20px' }}>طلباتي</h2>

                {requests.length === 0 ? (
                    <p style={{ color: 'rgba(0,0,0,0.5)', fontStyle: 'italic' }}>لم يتم العثور على طلبات.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {requests.map((req) => (
                            <div key={req.id} style={{
                                background: 'rgba(0,0,0,0.03)',
                                padding: '16px',
                                borderRadius: '8px',
                                border: '1px solid rgba(0,0,0,0.1)'
                            }} dir="rtl">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '1.1rem' }}>
                                        {req.type === 'DIPLOMA' ? 'دبلوم' :
                                            req.type === 'CERTIFICATE' ? 'شهادة مدرسية' : 'الابلاغ عن شكوة'}
                                    </h3>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        background: req.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.1)' :
                                            req.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.1)' :
                                                'rgba(234, 179, 8, 0.1)',
                                        color: req.status === 'APPROVED' ? '#10b981' :
                                            req.status === 'REJECTED' ? '#ef4444' :
                                                '#eab308'
                                    }}>
                                        {req.status === 'APPROVED' ? 'تم استخراج الوثيقة' :
                                            req.status === 'REJECTED' ? 'مرفوض' : 'قيد المراجعة'}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.6)', marginBottom: '4px' }}>
                                    إلى: {req.faculty.name}
                                </div>
                                {req.description && (
                                    <p style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.8)' }}>"{req.description}"</p>
                                )}
                                <div style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.4)', marginTop: '8px' }}>
                                    {new Date(req.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
