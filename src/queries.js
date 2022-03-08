import { hashPassword } from './password';
import getJwt from './jwt';

const { credentialsStore, taskListStore } = require('./storage');

const queries = {
  hello: () => 'Hello world, my name is mutodo',
  login: async (_, { email, rawPassword }, context) => {
    const userCredentials = await credentialsStore.get(email);
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
  },
  tasklists: async (_, { uuid }, context) => {
    if (context.user === uuid) {
      const taskLists = await taskListStore.findByUser(uuid);
      return taskLists;
    }
    return null;
  }
};

export default queries;
