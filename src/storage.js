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
  }
});

export default storage;
