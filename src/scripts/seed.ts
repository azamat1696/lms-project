const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    try {
        await prisma.category.createMany({
           data: [
               { name: "Development" },
               { name: "Design" },
               { name: "Business" },
               { name: "Marketing" },
               { name: "IT & Software" },
               { name: "Personal Development" },
               { name: "Health & Fitness" },
               { name: "Music" },
               { name: "Teaching & Academics" },
               { name: "Lifestyle" },
           ]
        });
        console.log("Seeding successful")
    } catch (error) {
        console.error("Error while seeding:  ", error)
    } finally {
        await prisma.$disconnect()
    }
}
main()
// node scripts/seed.ts
