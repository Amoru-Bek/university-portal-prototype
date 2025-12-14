import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = 'student@univ.com'
    console.log(`Checking requests for ${email}...`)

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        console.log('User not found. No requests to delete.')
        return
    }

    const result = await prisma.documentRequest.deleteMany({
        where: { studentId: user.id }
    })

    console.log(`Successfully deleted ${result.count} requests.`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
