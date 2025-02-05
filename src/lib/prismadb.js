import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

// Prevent multiple instances in development
const globalForPrisma = global

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prismaClientSingleton()
}

export const prisma = globalForPrisma.prisma

export default prisma;
