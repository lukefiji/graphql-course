import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

import db from './db';

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
    users(parent, { query }, { db }, info) {
      if (!query) {
        return db.users;
      }

      // Filter users by name
      return db.users.filter(user => {
        return user.name.toLowerCase().includes(query.toLowerCase());
      });
    },
    posts(parent, { query }, { db }, info) {
      if (!query) {
        return db.posts;
      }

      const normalizedQuery = query.toLowerCase();

      return db.posts.filter(post => {
        return (
          post.title.toLowerCase().includes(normalizedQuery) ||
          post.body.toLowerCase().includes(normalizedQuery)
        );
      });
    },
    comments(parent, query, { db }, info) {
      return db.comments;
    }
  },
  // Mutation is CUD in CRUD
  Mutation: {
    createUser(parent, args, { db }, info) {
      const emailTaken = db.users.some(user => user.email === args.data.email);

      if (emailTaken) {
        // Errors get sent back to the client
        throw new Error('Email is already in use');
      }

      const user = {
        id: uuidv4(),
        ...args.data
      };

      db.users.push(user);

      return user;
    },
    deleteUser(parent, args, { db }, info) {
      const userIndex = db.users.findIndex(user => user.id === args.id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Make sure to keep in mind all associated data - the user's posts and comments
      const deletedUsers = db.users.splice(userIndex, 1);

      // Delete all of the User's posts and its associated comments
      db.posts = db.posts.filter(post => {
        const match = post.author === args.id;

        if (match) {
          // Comb throuch all comments and delete ones that match the post
          db.comments = db.comments.filter(comment => comment.post !== post.id);
        }
        // Only return posts that don't match
        return !match;
      });

      // Remove all comments by the user
      db.comments = db.comments.filter(comment => comment.author !== args.id);

      return deletedUsers[0];
    },
    createPost(parent, args, { db }, info) {
      const userExists = db.users.some(user => user.id === args.data.author);

      if (!userExists) {
        throw new Error('User not found');
      }

      const post = {
        id: uuidv4(),
        ...args.data
      };

      db.posts.push(post);

      return post;
    },
    deletePost(parent, args, { db }, info) {
      const postIndex = db.posts.findIndex(post => post.id === args.id);

      if (postIndex === -1) {
        throw new Error('Post not found');
      }

      // Remove matching post and store it to return
      const deletedPost = db.posts.splice(postIndex, 1);

      // Remove the post's comments
      db.comments = db.comments.filter(comment => comment.post !== args.id);

      return deletedPost[0];
    },
    createComment(parent, args, { db }, info) {
      const userExists = db.users.some(user => user.id === args.data.author);
      const postExists = db.posts.some(
        post => post.id === args.data.post && post.published
      );

      if (!userExists) {
        throw new Error('User not found');
      }

      if (!postExists) {
        throw new Error('Post not found');
      }

      const comment = {
        id: uuidv4(),
        ...args.data
      };

      db.comments.push(comment);

      return comment;
    },
    deleteComment(parent, args, { db }, info) {
      const commentIndex = db.comments.findIndex(
        comment => comment.id === args.id
      );

      if (commentIndex === -1) {
        throw new Error('Comment not found');
      }

      const deletedComment = db.comments.splice(commentIndex, 1);

      return deletedComment[0];
    }
  },
  Post: {
    author(parent, args, { db }, info) {
      return db.users.find(user => user.id === parent.author);
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => comment.post === parent.id);
    }
  },
  User: {
    posts(parent, args, { db }, info) {
      return db.posts.filter(post => post.author === parent.id);
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => comment.author === parent.id);
    }
  },
  Comment: {
    author(parent, args, { db }, info) {
      return db.users.find(user => user.id === parent.author);
    },
    post(parent, args, { db }, info) {
      return db.posts.find(post => post.id === parent.post);
    }
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql', // Path relative to app root
  resolvers,
  // Context gets passed on to every resolver in the project
  context: {
    db
  }
});

server.start(() => {
  // This callback runs when server is up & running
  console.log('Server is running on localhost:4000');
});
