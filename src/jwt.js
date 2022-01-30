const jose = require('jose');

const getJwt = async (uuid, email, jwtPrivateKey) =>
  new jose.SignJWT({ email })
    .setProtectedHeader({ alg: 'ES256' })
    .setSubject(uuid)
    .setExpirationTime('2h')
    .setIssuer('https://mutodo.jasont.dev')
    .sign(jwtPrivateKey);

export default getJwt;
