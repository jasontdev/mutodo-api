import storage from './storage';
import { hashPassword } from './password';
import { getJwt } from './jwt';

const queries = {
  hello: () => 'Hello world, my name is mutodo',
  login: async (_, { email, rawPassword }, context) => {
    const { credentials } = storage(context.prismaClient);
    const userCredentials = await credentials.get(email);
    if (!userCredentials) {
      return { jwt: null };
    }

    const hashedPassword = hashPassword(
      rawPassword,
      userCredentials.passwordSalt,
      context.passwordHashSecret
    );

    if (hashedPassword === userCredentials.password) {
      const token = getJwt(email, context.jwtPrivateKey);
      return { jwt: token };
    }

    return { jwt: null };
  }
};

export { queries };
