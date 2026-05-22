const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const skills = await prisma.skill.findMany({ take: 5 });
  console.log(skills);
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
