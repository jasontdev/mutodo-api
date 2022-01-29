const { createHmac, randomBytes } = require('crypto');

const hashPassword = (rawPassword, passwordSalt, passwordHashSecret) => {
  const hmac = createHmac('sha256', passwordHashSecret);
  hmac.update(rawPassword);
  hmac.update(passwordSalt);
  return hmac.digest('utf8');
};

const createSalt = () => randomBytes(64).toString('base64');

export { createSalt, hashPassword };
