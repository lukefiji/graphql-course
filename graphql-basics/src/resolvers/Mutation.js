import uuidv4 from 'uuid/v4';

// Mutation is CUD in CRUD
const Mutation = {
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
};

export default Mutation;