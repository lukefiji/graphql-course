const Query = {
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
};

export default Query;
