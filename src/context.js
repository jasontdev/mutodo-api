const buildContext = async ({ req, privateKey, publicKey, prismaInstance }) => {
  const jwt = req.headers.authorization;

  if (!jwt) {
    return {
      passwordHashSecret: 'doot doot da loot doot',
      prismaClient: prismaInstance,
      jwtPrivateKey: privateKey,
      jwtPublicKey: publicKey
    };
  }

  const { payload } = await jose.jwtVerify(jwt, publicKey);

  return {
    prismaClient: prismaInstance,
    jwtPrivateKey: privateKey,
    jwtPublicKey: publicKey,
    user: payload.sub
  };
};

export { buildContext };
