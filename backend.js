const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    hello: String
    users: [User]
  }

  type Mutation {
    addUser(name: String!, email: String!): User
    deleteUser(id: String!): [User]
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }
`;

let users = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Doe", email: "jane@example.com" },
];

const addUser = (args) => {
  const existingUser = users.find((user) => user.email === args.email);

  if (existingUser) {
    return null;
  }

  const newUser = { id: String(users.length + 1), ...args };
  users.push(newUser);
  return newUser;
};

const deleteUser = (args) => {
  users = users.filter((user) => user.id !== args.id);
  return users;
};

const resolvers = {
  Query: {
    hello: () => "Hello, world!",
    users: () => users,
  },
  Mutation: {
    addUser: (parent, args) => addUser(args),
    deleteUser: (parent, args) => deleteUser(args),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();

server.start().then(() => {
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});
