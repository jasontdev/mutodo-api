const jose = require('jose');

const queries = {
  hello: () => 'Hello world, my name is mutodo',
  login: async (_, { email, rawPassword }, context) => {
    const user = context.prismaClient.user.findUnique({
      where: {
        email: email,
        rawPassword: rawPassword
      }
    });

    if (user) {
      const jwt = await new jose.SignJWT({ 'urn:example:claim': true })
        .setProtectedHeader({ alg: 'ES256' })
        .setSubject(email)
        .setExpirationTime('2h')
        .setIssuer('https://mutodo.jasont.dev')
        .sign(context.jwtPrivateKey);
      return { jwt: jwt };
    }
  }
};

export { queries };
