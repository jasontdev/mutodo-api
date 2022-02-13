import { createSalt, hashPassword } from './password';

const { userStore, taskListStore } = require('./storage');

const mutations = {
  register: async (_, { email, rawPassword }, context) => {
    const passwordSalt = createSalt();
    const hashedPassword = hashPassword(
      rawPassword,
      passwordSalt,
      context.passwordHashSecret
    );

    const uuid = await userStore.create(email, hashedPassword, passwordSalt);
    return { uuid };
  },
  createTaskList: async (_, { users, title }, context) => {
    const newTaskList = await taskListStore.create({ title, users });
    return {
      title: newTaskList.title,
      id: newTaskList.id,
      users: newTaskList.users.map((user) => ({
        uuid: user.userUuid
      }))
    };
  }
};

export default mutations;
