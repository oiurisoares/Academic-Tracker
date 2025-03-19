import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
prisma.$connect()
    .then(() => { return console.info('Database initialised'); })
    .catch(console.error);

export default prisma;
