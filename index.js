const express = require('express');
// const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const app = express();
// app.use(cors());

const typeDefs = gql`
type Product {
    id: Int
    name: String
    category: String
    description: String
    price: Float
    rentPrice: Float
  }

  type Query {
    products: [Product]
  }

  type Mutation {
    createProduct(name: String!, description: String!): Product
  }
`;

const resolvers = {
  Query: {
    products: async () => {
      return await prisma.product.findMany();
    },
  },
  Mutation: {
    createProduct: async (_, { name, description }) => {
      return await prisma.product.create({
        data: {
          name,
          description,
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
