const getPrismaClient = require('./prisma-client');

const userStore = {
  create: async (email, hashedPassword, passwordSalt) => {
    const prismaClient = getPrismaClient();
    try {
      const user = await prismaClient.user.create({
        data: {
          credentials: {
            create: {
              email,
              password: hashedPassword,
              passwordSalt
            }
          }
        },
        select: {
          uuid: true
        }
      });
      return user.uuid;
    } catch (error) {
      return null;
    }
  }
};

const credentialsStore = {
  get: async (email) => {
    const prismaClient = getPrismaClient();

    return prismaClient.credentials.findUnique({
      where: {
        email
      },
      include: {
        user: true
      }
    });
  }
};

const taskListStore = {
  create: async ({ title, users }) => {
    const prismaClient = getPrismaClient();

    try {
      const newTaskList = await prismaClient.taskList.create({
        data: {
          title,
          users: {
            create: users.map((uuid) => ({
              user: { connect: { uuid } }
            }))
          }
        }
      });
      return newTaskList.id;
    } catch (error) {
      return null;
    }
  },
  findByUser: async (uuid) => {
    const prismaClient = getPrismaClient();

    try {
      const taskLists = await prismaClient.taskList.findMany({
        where: {
          users: {
            some: {
              user: {
                uuid
              }
            }
          }
        }
      });
      return taskLists;
    } catch (error) {
      return null;
    }
  }
};

const taskStore = {
  create: async ({ taskListId, task }) => {
    const prismaClient = getPrismaClient();
    // TODO use taskListId to connect new task to a tasklist
    try {
      const savedTask = await prismaClient.task.create({
        data: {
          title: task.title,
          taskList: {
            connect: { id: taskListId }
          }
        }
      });
      return savedTask;
    } catch (error) {
      return null;
    }
  },
  get: async ({ taskListId }) => {
    const prismaClient = getPrismaClient();

    try {
      const tasks = await prismaClient.task.findMany({
        where: {
          taskList: {
            id: taskListId
          }
        }
      });

      if (!tasks) {
        return [];
      }
      return tasks;
    } catch (error) {
      return [];
    }
  },
  delete: async ({ id }) => {
    const prismaClient = getPrismaClient();

    try {
      return prismaClient.task.delete({
        where: {
          id
        },
        select: {
          id: true
        }
      });
    } catch {
      return null;
    }
  }
};

module.exports = {
  credentialsStore,
  taskStore,
  taskListStore,
  userStore
};
