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

const createTaskList = (title, uuid) =>
  prismaClient.taskList.create({
    data: {
      title,
      users: {
        create: [
          {
            user: { connect: { uuid } }
          }
        ]
      }
    }
  });

beforeEach(async () => {
  prismaClient = getPrismaClient();
  await prismaClient.credentials.deleteMany({});
  await prismaClient.task.deleteMany({});
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
  const { uuid } = await createUser(prismaClient);
  await createTaskList('First task list', uuid);
  await createTaskList('Second task list', uuid);

  const { taskLists } = storage(prismaClient);
  const lists = await taskLists.findByUser(uuid);
  const titles = lists.map((list) => list.title);
  expect(titles.length).toBe(2);
});

test('add task to task list', async () => {
  const { tasks } = storage(prismaClient);

  const { uuid } = await createUser(prismaClient);
  const { id } = await createTaskList('Test task lest', uuid);

  const newTask = tasks.save({
    taskListId: id,
    task: { title: 'Test task' }
  });

  expect(newTask).not.toBe(null);
});

test('find tasks', async () => {
  const { tasks } = storage(prismaClient);
  const { uuid } = await createUser(prismaClient);
  const { id } = await createTaskList('Test task lest', uuid);

  await prismaClient.task.create({
    data: {
      title: 'Take out the garbage',
      taskList: {
        connect: {
          id
        }
      }
    }
  });

  await prismaClient.task.create({
    data: {
      title: 'Buy food for Alfred',
      taskList: {
        connect: {
          id
        }
      }
    }
  });

  const savedTasks = await tasks.get({ taskListId: id });
  expect(savedTasks.length).toBe(2);
});

test('fail to find tasks', async () => {
  const { tasks } = storage(prismaClient);
  const { uuid } = await createUser(prismaClient);
  const { id } = await createTaskList('Test task lest', uuid);

  const savedTasks = await tasks.get(id);
  expect(savedTasks.length).toBe(0);
});
