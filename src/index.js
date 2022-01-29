const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { PrismaClient, prisma } = require('@prisma/client');
const jose = require('jose');

import { queries } from './queries.js';
import { mutations } from './mutations.js';
import { typeDefs } from './typedefs.js';
import { buildContext } from './context.js';

(async () => {
  const prismaInstance = new PrismaClient();
  const { publicKey, privateKey } = await jose.generateKeyPair('ES256');

  const server = new ApolloServer({
    typeDefs,
    resolvers: {
      Query: queries,
      Mutation: mutations
    },
    context: ({ req }) =>
      buildContext({ req, publicKey, privateKey, prismaInstance })
  });
  const app = express();

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
})();
