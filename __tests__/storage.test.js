const getPrismaClient = require('../src/prisma-client');
const storage = require('../src/storage');

let prismaClient = null;

beforeEach(async () => {
  prismaClient = getPrismaClient();
  await prismaClient.credentials.deleteMany({});
  await prismaClient.user.deleteMany({});
});

afterEach(async () => {
  await prismaClient.credentials.deleteMany({});
  await prismaClient.user.deleteMany({});
});

test('create single user with credentials', async () => {
  const { users } = storage(prismaClient);
  const uuid = await users.save('tobias@email.com', 'abcd1234', 'abcd1234');
  expect(uuid).not.toBe(null);
});

test('attempt to create user with non-unique email', async () => {
  const { users } = storage(prismaClient);
  let uuid = await users.save('tobias@email.com', 'abcd1234', 'abcd1234');
  uuid = await users.save('tobias@email.com', 'abcd1234', 'abcd1234');
  expect(uuid).toBe(null);
});

test('retrieve a single saved credential', async () => {
  await prismaClient.user.create({
    data: {
      credentials: {
        create: {
          email: 'alfred@email.com',
          password: 'adfasdasdasd',
          passwordSalt: 'asdasdasd'
        }
      }
    }
  });

  const { credentials } = storage(prismaClient);
  const savedCredentials = await credentials.get('alfred@email.com');
  expect(savedCredentials.email).toBe('alfred@email.com');
});

test('fail to retrieve a non-existant credential', async () => {
  await prismaClient.user.create({
    data: {
      credentials: {
        create: {
          email: 'alfred@email.com',
          password: 'adfasdasdasd',
          passwordSalt: 'asdasdasd'
        }
      }
    }
  });

  const { credentials } = storage(prismaClient);

  const notSavedCredentials = await credentials.get('jason@email.com');
  expect(notSavedCredentials).toBe(null);
});
