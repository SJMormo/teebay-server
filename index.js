const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

const typeDefs = gql`
  type User {
    id: Int
    name: String
    email: String
    userProducts: [UserProduct!]
  }
  type Product {
    id: Int
    title: String
    description: String
    category: String
    price: Float
    rentPrice: Float
    rentType: String
    userProducts: [UserProduct!]
  }
  type UserProduct {
    id: Int       # Primary key
    userId: Int   # Foreign key referencing User
    productId: Int  # Foreign key referencing Product
    user: User     # Relationship to User
    product: Product  # Relationship to Product
  }
  
  

  type Query {
    users: [User]
  }

  type Mutation {
    createUser(name: String!, email: String!): User
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      return prisma.user.findMany();
    },
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      const user = await prisma.user.create({
        data: {
          name,
          email,
        },
      });
      return user;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

// Call server.start() before applying middleware
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
