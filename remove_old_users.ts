import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // List of valid emails from credentials.md
    const validEmails = [
        'student@univ.com',
        'admin-tech@univ.com',
        'admin-eco@univ.com',
        'admin-social@univ.com',
        'admin-letters@univ.com',
        'admin-law@univ.com'
    ]

    console.log('Cleaning up old users...')

    // Delete everything NOT in the valid list
    const result = await prisma.user.deleteMany({
        where: {
            email: {
                notIn: validEmails
            }
        }
    })

    console.log(`Deleted ${result.count} old/invalid accounts.`)

    const remaining = await prisma.user.findMany()
    console.log(`Remaining valid users: ${remaining.length}`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
