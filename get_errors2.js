const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const records = await prisma.publicationRecord.findMany({
    where: { status: 'FAILED' },
    orderBy: { createdAt: 'desc' },
    take: 6,
    include: { auditLogs: true }
  });
  console.log(JSON.stringify(records, null, 2));
}
run();
