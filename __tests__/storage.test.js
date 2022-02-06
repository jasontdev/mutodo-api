const getPrismaClient = require('../src/prisma-client');
const storage = require('../src/storage');

let prismaClient = null;

const createUser = (prisma) =>
  prismaClient.user.create({
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

beforeEach(async () => {
  prismaClient = getPrismaClient();
  await prismaClient.credentials.deleteMany({});
  await prismaClient.taskListsAndUsers.deleteMany({});
  await prismaClient.taskList.deleteMany({});
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
  await createUser(prismaClient);
  const { credentials } = storage(prismaClient);
  const savedCredentials = await credentials.get('alfred@email.com');
  expect(savedCredentials.email).toBe('alfred@email.com');
});

test('fail to retrieve a non-existant credential', async () => {
  await createUser(prismaClient);
  const { credentials } = storage(prismaClient);
  const notSavedCredentials = await credentials.get('jason@email.com');
  expect(notSavedCredentials).toBe(null);
});

test('create task list with single user', async () => {
  const { uuid } = await createUser(prismaClient);
  const { taskLists } = storage(prismaClient);
  const id = await taskLists.create({ title: 'Tesk task list', users: [uuid] });
  expect(id).not.toBe(null);
});

test('retrieve all tasks lists by user', async () => {
  const { uuid } = await prismaClient.user.create({
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

  await prismaClient.taskList.create({
    data: {
      title: 'First task list',
      users: {
        create: [
          {
            user: { connect: { uuid } }
          }
        ]
      }
    }
  });

  await prismaClient.taskList.create({
    data: {
      title: 'Second task list',
      users: {
        create: [
          {
            user: { connect: { uuid } }
          }
        ]
      }
    }
  });

  const { taskLists } = storage(prismaClient);
  const lists = await taskLists.findByUser(uuid);
  const titles = lists.map((list) => list.title);
  expect(titles).toStrictEqual(['First task list', 'Second task list']);
});
