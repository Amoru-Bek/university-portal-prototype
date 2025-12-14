import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting cleanup of Arabic faculties...')

  // Find all faculties starting with "كلية"
  const arabicFaculties = await prisma.faculty.findMany({
    where: {
      name: {
        startsWith: 'كلية'
      }
    }
  })

  if (arabicFaculties.length === 0) {
    console.log('No Arabic faculties found.')
    return
  }

  const ids = arabicFaculties.map(f => f.id)
  console.log(`Found ${ids.length} faculties to delete.`)

  // 1. Delete dependent DocumentRequests
  const deletedRequests = await prisma.documentRequest.deleteMany({
    where: {
      facultyId: { in: ids }
    }
  })
  console.log(`- Deleted ${deletedRequests.count} related requests`)

  // 2. Delete dependent Users
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      facultyId: { in: ids }
    }
  })
  console.log(`- Deleted ${deletedUsers.count} related users`)

  // 3. Delete the Faculties
  const deletedFaculties = await prisma.faculty.deleteMany({
    where: {
      id: { in: ids }
    }
  })
  console.log(`- Deleted ${deletedFaculties.count} faculties`)
  console.log('Cleanup complete!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
