import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const faculties = [
    { name: 'كلية العلوم والتكنولوجيا', email: 'admin-tech@univ.com' },
    { name: 'كلية الاقتصاد والأعمال والإدارة', email: 'admin-eco@univ.com' },
    { name: 'كلية العلوم الاجتماعية والإنسانية', email: 'admin-social@univ.com' },
    { name: 'كلية الآداب واللغات', email: 'admin-letters@univ.com' },
    { name: 'كلية الحقوق والعلوم السياسية', email: 'admin-law@univ.com' },
  ]

  for (const facultyData of faculties) {
    const faculty = await prisma.faculty.upsert({
      where: { name: facultyData.name },
      update: {},
      create: { name: facultyData.name },
    })

    console.log('Created / Updated faculty:', faculty.name)

    const admin = await prisma.user.upsert({
      where: { email: facultyData.email },
      update: {
        facultyId: faculty.id
      },
      create: {
        email: facultyData.email,
        password: "admin",
        name: `Admin ${facultyData.name.split(' ').slice(0, 2).join(' ')}`,
        role: "ADMIN",
        facultyId: faculty.id
      }
    })
    console.log('Created admin:', admin.email)
  }

  // Create a generic student
  const student = await prisma.user.upsert({
    where: { email: "student@univ.com" },
    update: {},
    create: {
      email: "student@univ.com",
      password: "student",
      name: "John Student",
      role: "STUDENT",
    }
  })
  console.log('Created student:', student.email)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
