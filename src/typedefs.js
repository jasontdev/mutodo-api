const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    uuid: String!
    name: String
    email: String!
    credentials: Credentials!
    taskLists: [TaskList]
  }

  type Credentials {
    id: ID!
    email: String!
  }

  type AccessToken {
    uuid: String
    jwt: String
  }

  type UUID {
    uuid: String
  }

  type TaskList {
    id: ID!
    title: String
    tasks: [Task]
    users: [User]
  }

  type Task {
    id: ID!
    title: String!
    isComplete: Boolean!
    description: String
  }

  type Query {
    hello: String
    login(email: String!, rawPassword: String!): AccessToken
    tasklists(uuid: String!): [TaskList]
  }

  type Mutation {
    register(email: String!, rawPassword: String!): UUID
    createTaskList(title: String!, users: [String]!): TaskList
  }
`;

export default typeDefs;
