const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();

const typeDefs = gql`
  type Product {
    id: Int
    name: String
    category: String
    description: String
    price: Float
    rentPrice: Float
    owners: [User]
  }

  type User {
    id: Int
    name: String
    products: [Product]
  }

  type Query {
    products: [Product]
  }

  type Mutation {
    createUser(name: String!): User
  }
`;

const resolvers = {
  Query: {
    products: async () => {
      return await prisma.product.findMany();
    },
  },
  Mutation: {
    createUser: async (_, { name }) => {
      return await prisma.user.create({
        data: {
          name,
        },
      });
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
