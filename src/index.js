import queries from './queries';
import mutations from './mutations';
import typeDefs from './typedefs';
import buildContext from './context';
import getPrismaClient from './prisma-client';

require('./dotenv-config');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const jose = require('jose');

(async () => {
  const prismaInstance = getPrismaClient();
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
