import { GraphQLServer } from 'graphql-yoga';

import db from './db';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import User from './resolvers/User';
import Post from './resolvers/Post';
import Comment from './resolvers/Comment';

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql', // Path relative to app root
  resolvers: {
    Query,
    Mutation,
    User,
    Post,
    Comment
  },
  // Context gets passed on to every resolver in the project
  context: {
    db
  }
});

server.start(() => {
  // This callback runs when server is up & running
  console.log('Server is running on localhost:4000');
});
