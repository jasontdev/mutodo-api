import { createSalt, hashPassword } from './password';

const storage = require('./storage');

const mutations = {
  register: async (_, { email, rawPassword }, context) => {
    const { users } = storage(context.prismaClient);
    const passwordSalt = createSalt();
    const hashedPassword = hashPassword(
      rawPassword,
      passwordSalt,
      context.passwordHashSecret
    );

    const uuid = await users.save(email, hashedPassword, passwordSalt);
    return { uuid };
  }
};

export default mutations;
