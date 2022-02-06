const storage = (prismaClient) => ({
  users: {
    save: async (email, hashedPassword, passwordSalt) => {
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
  },
  credentials: {
    get: async (email) =>
      prismaClient.credentials.findUnique({
        where: {
          email
        },
        include: {
          user: true
        }
      })
  },
  taskLists: {
    create: async ({ title, users }) => {
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
  }
});

module.exports = storage;
