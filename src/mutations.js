const mutations = {
  register: async (_, { email, rawPassword }, context) => {
    return await context.prismaClient.user.create({
      data: {
        email: email,
        credentials: {
          create: {
            password: rawPassword
          }
        }
      }
    });
  }
};

export { mutations };
