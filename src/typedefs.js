const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID
    email: String!
    name: String
  }

  type AccessToken {
    jwt: String
  }

  type Query {
    hello: String
    login(email: String!, rawPassword: String!): AccessToken
  }

  type Mutation {
    register(email: String!, rawPassword: String!): User
  }
`;

export default typeDefs;
