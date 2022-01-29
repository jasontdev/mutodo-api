const jose = require('jose');

const getJwt = async (email, jwtPrivateKey) =>
  new jose.SignJWT({ 'urn:example:claim': true })
    .setProtectedHeader({ alg: 'ES256' })
    .setSubject(email)
    .setExpirationTime('2h')
    .setIssuer('https://mutodo.jasont.dev')
    .sign(jwtPrivateKey);

export { getJwt };