import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const mappings = {
    'Faculté des sciences et de la technologie': 'كلية العلوم والتكنولوجيا',
    'Faculté des sciences économiques et commerciales et des science de gestion': 'كلية الاقتصاد والأعمال والإدارة',
    'Faculté des sciences sociales et humaine': 'كلية العلوم الاجتماعية والإنسانية',
    'Faculté des lettre et langue': 'كلية الآداب واللغات',
    'Faculté de droit et des science politiques': 'كلية الحقوق والعلوم السياسية'
}

async function main() {
    console.log('Starting faculty name localization...')

    for (const [french, arabic] of Object.entries(mappings)) {
        const result = await prisma.faculty.updateMany({
            where: { name: french },
            data: { name: arabic }
        })

        if (result.count > 0) {
            console.log(`✅ Updated: "${french}" -> "${arabic}"`)
        } else {
            console.log(`⚠️  Skipped (not found): "${french}"`)
        }
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
