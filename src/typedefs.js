const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    uuid: String!
    name: String
    email: String!
    credentials: Credentials!
  }

  type Credentials {
    id: ID!
    email: String!
  }

  type AccessToken {
    jwt: String
  }

  type UUID {
    uuid: String
  }

  type TaskList {
    id: ID!
    title: String
    users: [User]
  }

  type Query {
    hello: String
    login(email: String!, rawPassword: String!): AccessToken
  }

  type Mutation {
    register(email: String!, rawPassword: String!): UUID
    createTaskList(title: String!, users: [String]!): TaskList
  }
`;

export default typeDefs;
