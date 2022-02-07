import { createSalt, hashPassword } from './password';

const { userStore } = require('./storage');

const mutations = {
  register: async (_, { email, rawPassword }, context) => {
    const passwordSalt = createSalt();
    const hashedPassword = hashPassword(
      rawPassword,
      passwordSalt,
      context.passwordHashSecret
    );

    const uuid = await userStore.save(email, hashedPassword, passwordSalt);
    return { uuid };
  }
};

export default mutations;
