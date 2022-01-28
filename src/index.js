const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { PrismaClient, prisma } = require('@prisma/client');
const jose = require('jose');

import { queries } from './queries.js';
import { mutations } from './mutations.js';
import { typeDefs } from './typedefs.js';

const prismaInstance = new PrismaClient();

const buildContext = async ({ req, privateKey, publicKey }) => {
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

(async () => {
  const { publicKey, privateKey } = await jose.generateKeyPair('ES256');
  const server = new ApolloServer({
    typeDefs,
    resolvers: {
      Query: queries,
      Mutation: mutations
    },
    context: ({ req }) => buildContext({ req, publicKey, privateKey })
  });
  const app = express();

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
})();
