const jose = require('jose');
const { createHmac } = require('crypto');

const queries = {
  hello: () => 'Hello world, my name is mutodo',
  login: async (_, { email, rawPassword }, context) => {
    const credentials = await context.prismaClient.credentials.findUnique({
      where: {
        email: email
      },
      include: {
        user: true
      }
    });

    if (!credentials) {
      console.log('Credentials not found...');
      return {
        jwt: null
      };
    } else {
      const hmac = createHmac('sha256', context.passwordHashSecret);
      hmac.update(rawPassword);
      hmac.update(credentials.passwordSalt);
      const hashedPassword = hmac.digest('utf8');

      if (credentials.password !== hashedPassword) {
        return { jwt: null };
      }
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
