import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

const USER_PASSWORD = process.env.USER_PASSWORD
if (!USER_PASSWORD) {
  throw new Error("USER_PASSWORD environment variable is required for seeding")
}

async function seed() {
  // Nettoyage de la base de données
  await prisma.tag.deleteMany({})
  await prisma.history.deleteMany({})
  await prisma.snippet.deleteMany({})
  await prisma.folder.deleteMany({})
  await prisma.user.deleteMany({})

  // Création des tags communs
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "JavaScript", color: "#F7DF1E" } }),
    prisma.tag.create({ data: { name: "TypeScript", color: "#3178C6" } }),
    prisma.tag.create({ data: { name: "React", color: "#61DAFB" } }),
    prisma.tag.create({ data: { name: "Node.js", color: "#339933" } }),
    prisma.tag.create({ data: { name: "Python", color: "#3776AB" } }),
  ])

  // Création d'un utilisateur admin
  const hashedPassword = await bcrypt.hash(USER_PASSWORD || "", 10)

  const admin = await prisma.user.create({
    data: {
      email: "admin@admin.com",
      hashedPassword,
      name: "Admin User",
      isAdmin: true,
    },
  })

  // Création des dossiers et snippets pour l'admin
  const jsFolder = await prisma.folder.create({
    data: {
      name: "JavaScript",
      userId: admin.id,
      snippets: {
        create: [
          {
            title: "Array Methods",
            description: "Common JavaScript array methods",
            content: `// Map example
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(num => num * 2);

// Filter example
const evenNumbers = numbers.filter(num => num % 2 === 0);

// Reduce example
const sum = numbers.reduce((acc, curr) => acc + curr, 0);`,
            language: "javascript",
            isPublic: true,
            userId: admin.id,
            tags: {
              connect: [{ name: "JavaScript" }],
            },
            history: {
              create: [
                {
                  content: "// Initial version\nconst numbers = [1, 2, 3, 4];",
                  version: 1,
                },
              ],
            },
          },
        ],
      },
    },
  })

  console.log("jsFolder", jsFolder)

  const reactFolder = await prisma.folder.create({
    data: {
      name: "React",
      userId: admin.id,
      snippets: {
        create: [
          {
            title: "useState Hook",
            description: "Basic useState hook example",
            content: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
            language: "typescript",
            isPublic: true,
            userId: admin.id,
            tags: {
              connect: [{ name: "React" }, { name: "TypeScript" }],
            },
          },
        ],
      },
    },
  })

  console.log("reactFolder", reactFolder)

  // Création d'un utilisateur normal avec mot de passe hashé
  const userHashedPassword = await bcrypt.hash(USER_PASSWORD || "", 10)

  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      hashedPassword: userHashedPassword,
      name: "Regular User",
    },
  })

  // Création du dossier et snippet pour l'utilisateur normal
  const userFolder = await prisma.folder.create({
    data: {
      name: "Mes Snippets",
      userId: user.id,
      snippets: {
        create: [
          {
            title: "Hello World",
            description: "A simple Python hello world",
            content: 'print("Hello, World!")',
            language: "python",
            isPublic: false,
            userId: user.id,
            tags: {
              connect: [{ name: "Python" }],
            },
          },
        ],
      },
    },
  })

  console.log("userFolder", userFolder)

  console.log(`Base de données initialisée avec :`)
  console.log(`- Admin : ${admin.email}`)
  console.log(`- User  : ${user.email}`)
  console.log("\nStructure créée :")
  console.log("- Tags :", tags.map((t) => t.name).join(", "))
  console.log(`- Dossiers admin : JavaScript, React`)
  console.log(`- Dossiers user : Mes Snippets`)
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
