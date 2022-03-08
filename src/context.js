const jose = require('jose');

const buildContext = async ({ req, privateKey, publicKey, prismaInstance }) => {
  const createContext = () => ({
    passwordHashSecret: process.env.PASSWORD_HASH_KEY,
    prismaClient: prismaInstance,
    jwtPrivateKey: privateKey,
    jwtPublicKey: publicKey
  });

  if (req.headers.authorization) {
    const [bearer, jwt] = req.headers.authorization.split(' ');

    if (bearer === 'Bearer') {
      try {
        const { payload } = await jose.jwtVerify(jwt, publicKey);

        let context = createContext();
        context.user = payload.sub; // payload.sub == uuid
        return context;
      } catch (error) {
        // jose.jwtVerify throws exception when verification fails
        return createContext();
      }
    }
  } else {
    return createContext();
  }
};

export default buildContext;
