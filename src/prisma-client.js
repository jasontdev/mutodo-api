const { PrismaClient } = require('@prisma/client');

const getPrismaClient = () => {
  if (process.env.NODE_ENV === 'production') {
    return new PrismaClient();
  }

  if (global.prismaClient) {
    return global.prismaClient;
  }

  global.prismaClient = new PrismaClient();
  return global.prismaClient;
};

module.exports = getPrismaClient;
