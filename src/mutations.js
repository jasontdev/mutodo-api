const { createHmac, randomBytes } = require('crypto');

const mutations = {
  register: async (_, { email, rawPassword }, context) => {
    // TODO: conversion to string seems suspect. surely causes 'clipping'?
    const passwordSalt = randomBytes(64).toString('base64');
    const hmac = createHmac('sha256', context.passwordHashSecret);
    hmac.update(rawPassword);
    hmac.update(passwordSalt);
    const hashedPassword = hmac.digest('utf8');

    return await context.prismaClient.user.create({
      data: {
        credentials: {
          create: {
            email: email,
            password: hashedPassword,
            passwordSalt: passwordSalt
          }
        }
      }
    });
  }
};

export { mutations };
