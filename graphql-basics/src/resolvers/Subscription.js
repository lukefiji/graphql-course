const Subscription = {
  // Subscriptions require an object
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      const post = db.posts.find(post => post.id === postId && post.published);

      if (!post) {
        throw new Error('Post not found');
      }

      // Allows the subscription to happen
      return pubsub.asyncIterator(`comment ${postId}`);
    }
  },
  post: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator('post');
    }
  }
};

export default Subscription;
