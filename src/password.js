const { createHmac, randomBytes } = require('crypto');

const password = {
  hash: (rawPassword, passwordSalt, passwordHashSecret) => {
    const hmac = createHmac('sha256', passwordHashSecret);
    hmac.update(rawPassword);
    hmac.update(passwordSalt);
    return hmac.digest('utf8');
  },
  createSalt: () => {
    return randomBytes(64).toString('base64');
  }
};

export { password };
