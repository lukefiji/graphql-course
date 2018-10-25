import { GraphQLServer } from 'graphql-yoga';

// Type definitions (Schema)
const typeDefs = /* GraphQL */ `
  type Query {
    # Exclamation mark: Required return; cannot return null
    hello: String!
    name: String!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    // ES6 method definition
    hello() {
      return 'This is a hello query!';
    },
    name() {
      return 'Luke Fiji';
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  // This callback runs when server is up & running
  console.log('Server started.');
});
