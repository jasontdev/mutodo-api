import storage from './storage';
import { password } from './password';

const mutations = {
  register: async (_, { email, rawPassword }, context) => {
    const { users } = storage(context.prismaClient);
    const passwordSalt = password.createSalt();
    const hashedPassword = password.hash(
      rawPassword,
      passwordSalt,
      context.passwordHashSecret
    );

    const id = await users.save(email, hashedPassword, passwordSalt);
    return { id: id };
  }
};

export { mutations };
