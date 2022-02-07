import { hashPassword } from './password';
import getJwt from './jwt';

const { credentialsRepository } = require('./storage');

const queries = {
  hello: () => 'Hello world, my name is mutodo',
  login: async (_, { email, rawPassword }, context) => {
    const userCredentials = await credentialsRepository.get(email);
    if (!userCredentials) {
      return { jwt: null };
    }

    const hashedPassword = hashPassword(
      rawPassword,
      userCredentials.passwordSalt,
      context.passwordHashSecret
    );

    if (hashedPassword === userCredentials.password) {
      const token = getJwt(
        userCredentials.user.uuid,
        email,
        context.jwtPrivateKey
      );
      return { jwt: token };
    }

    return { jwt: null };
  }
};

export default queries;
