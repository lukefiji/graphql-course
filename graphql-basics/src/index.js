import { GraphQLServer } from 'graphql-yoga';

/**
 * Five GraphQL scalar types:
 * String, Boolean, Int, Float, ID
 */

// Demo user data
const users = [
  {
    id: '1',
    name: 'Luke',
    email: 'Luke@email.com'
  },
  {
    id: '2',
    name: 'Lukie Luke',
    email: 'LukieLuke@email.com',
    age: 26
  },
  {
    id: '2',
    name: "What's Gewde",
    email: 'NotYourAverage@email.com',
    age: 22
  }
];

const posts = [
  {
    id: '1',
    title: 'First Post',
    body: 'This is my first dream',
    published: true
  },
  {
    id: '2',
    title: 'Second Scene',
    body: 'This is my second post',
    published: true
  },
  {
    id: '3',
    title: 'Third Dream',
    body: 'This is my third scene',
    published: false
  }
];

// Type definitions (Schema)
const typeDefs = /* GraphQL */ `
  type Query {
    me: User!
    post: Post!
    posts(query: String): [Post!]!
    users(query: String): [User!]!
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
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }

      // Filter users by name
      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, { query }, ctx, info) {
      if (!query) {
        return posts;
      }

      const normalizedQuery = query.toLowerCase();

      return posts.filter(post => {
        return (
          post.title.toLowerCase().includes(normalizedQuery) ||
          post.body.toLowerCase().includes(normalizedQuery)
        );
      });
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
