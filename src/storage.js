const jose = require('jose');

const storage = (prismaClient) => ({
  users: {
    save: async (email, hashedPassword, passwordSalt) => {
      try {
        const user = await prismaClient.user.create({
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

        return user.id;
      } catch (error) {
        return null;
      }
    }
  },
  credentials: {
    get: async (email) => {
      return await prismaClient.credentials.findUnique({
        where: {
          email: email
        },
        include: {
          user: true
        }
      });
    }
  }
});

export default storage;
