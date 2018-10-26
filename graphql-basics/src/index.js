import { GraphQLServer } from 'graphql-yoga';

/**
 * Five GraphQL scalar types:
 * String, Boolean, Int, Float, ID
 */

// Type definitions (Schema)
const typeDefs = /* GraphQL */ `
  type Query {
    greeting(name: String, position: String): String!
    add(a: Float!, b: Float!): Float!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    /**
     * Parent - helpful when working /w relational data
     * Args - arguments
     * Context - contextual data
     * Info - info sent along to the sever
     */
    greeting(parent, args, ctx, info) {
      return args.name && args.position
        ? `Hello ${args.name}! You are an awesome ${args.position}!`
        : 'Hello!';
    },
    me() {
      return {
        id: '000001',
        name: 'Luke',
        email: 'luke.fiji@gmail.com'
      };
    },
    post() {
      return {
        id: '000001',
        title: 'First Post',
        body: 'This is the first post. Awesome!',
        published: true
      };
    },
    add(parent, args, ctx, info) {
      return args.a + args.b;
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
