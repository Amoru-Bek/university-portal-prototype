import { PrismaClient, DocumentRequest, User } from '@prisma/client'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

async function updateRequestStatus(formData: FormData) {
  'use server'
  const requestId = formData.get('requestId') as string
  const newStatus = formData.get('status') as string

  await prisma.documentRequest.update({
    where: { id: requestId },
    data: { status: newStatus }
  })

  revalidatePath('/admin/dashboard')
}

export default async function AdminDashboard() {
  const session = await getSession()
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  // Fetch only requests for this admin's faculty
  if (!session.user.facultyId) {
    return <div>Error: Admin has no assigned faculty</div>
  }

  const faculty = await prisma.faculty.findUnique({
    where: { id: session.user.facultyId }
  })

  const requests = await prisma.documentRequest.findMany({
    where: { facultyId: session.user.facultyId },
    include: { student: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem' }}>إدارة الطلبات</h1>
        <p style={{ color: 'rgba(0,0,0,0.6)' }}>
          الكلية: <strong style={{ color: 'var(--primary)' }}>{faculty?.name}</strong>
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ marginBottom: '20px' }}>الطلبات الواردة</h2>

        {requests.length === 0 ? (
          <p style={{ color: 'rgba(0,0,0,0.5)', fontStyle: 'italic' }}>لا توجد طلبات واردة.</p>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {requests.map((req) => (
              <div key={req.id} style={{
                background: 'rgba(0,0,0,0.03)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.1)',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '20px',
                alignItems: 'center'
              }} dir="rtl">
                <div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                      {req.type === 'DIPLOMA' ? 'دبلوم' :
                        req.type === 'CERTIFICATE' ? 'شهادة مدرسية' : 'الابلاغ عن شكوة'}
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      background: req.status === 'PENDING' ? 'rgba(234, 179, 8, 0.1)' :
                        req.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.1)' :
                          'rgba(239, 68, 68, 0.1)',
                      color: req.status === 'PENDING' ? '#eab308' :
                        req.status === 'APPROVED' ? '#10b981' :
                          '#ef4444'
                    }}>
                      {req.status === 'APPROVED' ? 'تم استخراج الوثيقة' :
                        req.status === 'REJECTED' ? 'مرفوض' : 'قيد المراجعة'}
                    </span>
                  </div>
                  <div style={{ color: 'rgba(0,0,0,0.8)', marginBottom: '4px' }}>
                    الطالب: {req.student.name} ({req.student.email})
                  </div>
                  {req.description && (
                    <p style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.6)', fontStyle: 'italic' }}>
                      "{req.description}"
                    </p>
                  )}
                  <div style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.4)', marginTop: '8px' }}>
                    تاريخ الطلب: {new Date(req.createdAt).toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {req.status === 'PENDING' && (
                    <>
                      <form action={updateRequestStatus}>
                        <input type="hidden" name="requestId" value={req.id} />
                        <input type="hidden" name="status" value="APPROVED" />
                        <button type="submit" className="btn-success">
                          تم استخراج الوثيقة
                        </button>
                      </form>
                      <form action={updateRequestStatus}>
                        <input type="hidden" name="requestId" value={req.id} />
                        <input type="hidden" name="status" value="REJECTED" />
                        <button type="submit" className="btn-danger">
                          رفض
                        </button>
                      </form>
                    </>
                  )}
                  {req.status !== 'PENDING' && (
                    <div style={{ color: 'rgba(0,0,0,0.4)', fontSize: '0.9rem' }}>
                      تمت المعالجة
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
