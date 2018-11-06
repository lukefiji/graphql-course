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
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find(user => user.id === id);

    if (!user) {
      throw new Error('User not found');
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(user => user.email === data.email);

      if (emailTaken) {
        throw new Error('Email already in use');
      }

      user.email = data.email;
    }

    if (typeof data.name === 'string') {
      user.name = data.name;
    }

    if (typeof data.age !== 'undefined') {
      user.age = data.age;
    }

    return user;
  },
  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);

    if (!userExists) {
      throw new Error('User not found');
    }

    const post = {
      id: uuidv4(),
      ...args.data
    };

    db.posts.push(post);

    // Only display if published
    if (args.data.published) {
      pubsub.publish('post', { post });
    }

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
  updatePost(parent, args, { db }, info) {
    const { id, data } = args;
    const post = db.posts.find(post => post.id === id);

    if (!post) {
      throw new Error('Post not found');
    }

    if (typeof data.title === 'string') {
      post.title = data.title;
    }

    if (typeof data.body === 'string') {
      post.body = data.body;
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published;
    }

    return post;
  },
  createComment(parent, args, { db, pubsub }, info) {
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

    // First argument: Channel
    // Second argument : What to publish to channel - must match schema
    pubsub.publish(`comment ${args.data.post}`, {
      comment
    });

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
  },
  updateComment(parent, args, { db }, info) {
    const { id, data } = args;
    const comment = db.comments.find(comment => comment.id === id);

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (typeof data.text === 'string') {
      comment.text = data.text;
    }

    return comment;
  }
};

export default Mutation;
