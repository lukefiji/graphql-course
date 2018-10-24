// Named export - Has a name. Have as many as needed.
// Default export - Has no name. You can only have one.

const message = 'Some message from myModule.js';
const name = 'Luke';
const location = 'Irvine';
const getGreeting = name => {
  return `What's good ${name}!`;
};

export { message, name, getGreeting, location as default };
