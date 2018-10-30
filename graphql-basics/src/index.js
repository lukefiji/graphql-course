import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';
import { UniqueDirectivesPerLocation } from 'graphql/validation/rules/UniqueDirectivesPerLocation';
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
    id: '3',
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
    published: true,
    author: '1'
  },
  {
    id: '2',
    title: 'Second Scene',
    body: 'This is my second post',
    published: true,
    author: '1'
  },
  {
    id: '3',
    title: 'Third Dream',
    body: 'This is my third scene',
    published: false,
    author: '2'
  }
];

const comments = [
  {
    id: '1',
    text: 'First post!',
    author: '1',
    post: '3'
  },
  {
    id: '2',
    text: 'This is so cool!',
    author: '3',
    post: '2'
  },
  {
    id: '3',
    text: 'Thanks for sharing.',
    author: '3',
    post: '1'
  },
  {
    id: '4',
    text: 'I agree with everything you said.',
    author: '2',
    post: '2'
  }
];

// Type definitions (Schema)
const typeDefs = /* GraphQL */ `
  type Query {
    me: User!
    post: Post!
    posts(query: String): [Post!]!
    users(query: String): [User!]!
    comments: [Comment!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
    createPost(
      title: String!
      body: String!
      published: Boolean!
      author: ID!
    ): Post!
    createComment(text: String!, author: ID!, post: ID!): Comment!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    users(parent, { query }, ctx, info) {
      if (!query) {
        return users;
      }

      // Filter users by name
      return users.filter(user => {
        return user.name.toLowerCase().includes(query.toLowerCase());
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
    },
    comments(parent, query, ctx, info) {
      return comments;
    }
  },
  // Mutation is CUD in CRUD
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => user.email === args.email);

      if (emailTaken) {
        // Errors get sent back to the client
        throw new Error('Email is already in use');
      }

      const user = {
        id: uuidv4(),
        ...args
      };

      users.push(user);

      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.author);

      if (!userExists) {
        throw new Error('User not found');
      }

      const post = {
        id: uuidv4(),
        ...args
      };

      posts.push(post);

      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.author);
      const postExists = posts.some(
        post => post.id === args.post && post.published
      );

      if (!userExists) {
        throw new Error('User not found');
      }

      if (!postExists) {
        throw new Error('Post not found');
      }

      const comment = {
        id: uuidv4(),
        ...args
      };

      comments.push(comment);

      return comment;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id);
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.author === parent.id);
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    },
    post(parent, args, ctx, info) {
      return posts.find(post => post.id === parent.post);
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
