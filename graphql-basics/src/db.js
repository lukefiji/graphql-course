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

const db = {
  users,
  posts,
  comments
};

export { db as default };
