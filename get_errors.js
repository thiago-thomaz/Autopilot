const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const logs = await prisma.publicationLog.findMany({
    where: { status: 'FAILED' },
    orderBy: { createdAt: 'desc' },
    take: 6
  });
  console.log(logs.map(l => l.errorMessage));
}
run();
