const jose = require('jose');

const buildContext = async ({ req, privateKey, publicKey, prismaInstance }) => {
  const jwt = req.headers.authorization;

  if (!jwt) {
    return {
      passwordHashSecret: process.env.PASSWORD_HASH_KEY,
      prismaClient: prismaInstance,
      jwtPrivateKey: privateKey,
      jwtPublicKey: publicKey
    };
  }

  const { payload } = await jose.jwtVerify(jwt, publicKey);

  return {
    passwordHashSecret: process.env.PASSWORD_HASH_KEY,
    prismaClient: prismaInstance,
    jwtPrivateKey: privateKey,
    jwtPublicKey: publicKey,
    user: payload.sub
  };
};

export { buildContext };
