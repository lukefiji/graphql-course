import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  // Options object
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
});
