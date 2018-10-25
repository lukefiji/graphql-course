import { GraphQLServer } from 'graphql-yoga';

/**
 * Five GraphQL scalar types:
 * String, Boolean, Int, Float, ID
 */

// Type definitions (Schema)
const typeDefs = /* GraphQL */ `
  type Query {
    id: ID!
    name: String!
    age: Int!
    employed: Boolean!
    gpa: Float
  }
`;

// Resolvers
const resolvers = {
  Query: {
    id() {
      return 'abc123';
    },
    name() {
      return 'Luke';
    },
    age() {
      return 25;
    },
    employed() {
      return true;
    },
    gpa() {
      return null;
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  // This callback runs when server is up & running
  console.log('Server is running on localhost:4000');
});
