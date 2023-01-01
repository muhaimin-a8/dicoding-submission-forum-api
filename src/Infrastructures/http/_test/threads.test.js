const container = require('../../container');
const createServer = require('../createServer');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestAddThreadPayload = {
        title: 'new thread',
      };
      const server = await createServer(container);
      /* adding user */
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: requestAuthPayload.username,
          password: requestAuthPayload.password,
          fullname: 'Dicoding Indonesia',
        },
      });

      // Action
      /* login */
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestAuthPayload,
      });
      const responseAuthJson = JSON.parse(responseAuth.payload);

      /* adding thread */
      const responseAddThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestAddThreadPayload,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseAddThreadJson = JSON.parse(responseAddThread.payload);
      expect(responseAddThread.statusCode).toEqual(400);
      expect(responseAddThreadJson.status).toEqual('fail');
      expect(responseAddThreadJson.message).toBeDefined();
      expect(responseAddThreadJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload title more than 200 character', async () => {
      // Arrange
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestAddThreadPayload = {
        title: 'new thread'.repeat(200),
        body: 'new thread body',
      };
      const server = await createServer(container);
      /* adding user */
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: requestAuthPayload.username,
          password: requestAuthPayload.password,
          fullname: 'Dicoding Indonesia',
        },
      });

      // Action
      /* login */
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestAuthPayload,
      });
      const responseAuthJson = JSON.parse(responseAuth.payload);

      /* adding thread */
      const responseAddThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestAddThreadPayload,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseAddThreadJson = JSON.parse(responseAddThread.payload);
      expect(responseAddThread.statusCode).toEqual(400);
      expect(responseAddThreadJson.status).toEqual('fail');
      expect(responseAddThreadJson.message).toBeDefined();
      expect(responseAddThreadJson.message).toEqual('tidak dapat membuat thread baru karena karakter title melebihi batas limit');
    });

    it('should rresponse 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestAddThreadPayload = {
        title: 'new thread',
        body: [],
      };
      const server = await createServer(container);
      /* adding user */
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: requestAuthPayload.username,
          password: requestAuthPayload.password,
          fullname: 'Dicoding Indonesia',
        },
      });

      // Action
      /* login */
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestAuthPayload,
      });
      const responseAuthJson = JSON.parse(responseAuth.payload);

      /* adding thread */
      const responseAddThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestAddThreadPayload,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseAddThreadJson = JSON.parse(responseAddThread.payload);
      expect(responseAddThread.statusCode).toEqual(400);
      expect(responseAddThreadJson.status).toEqual('fail');
      expect(responseAddThreadJson.message).toBeDefined();
      expect(responseAddThreadJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });

    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestAddThreadPayload = {
        title: 'new thread',
        body: 'new thread body',
      };
      const server = await createServer(container);

      /* adding user */
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: requestAuthPayload.username,
          password: requestAuthPayload.password,
          fullname: 'Dicoding Indonesia',
        },
      });

      // Action
      /* login */
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestAuthPayload,
      });
      const responseAuthJson = JSON.parse(responseAuth.payload);
      /* adding thread */
      const responseAddThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestAddThreadPayload,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseAddThreadJson = JSON.parse(responseAddThread.payload);
      expect(responseAddThread.statusCode).toEqual(201);
      expect(responseAddThreadJson.status).toEqual('success');
      expect(responseAddThreadJson.data.addedThread).toBeDefined();
      expect(responseAddThreadJson.data.addedThread.title).toEqual(requestAddThreadPayload.title);
    });
  });
});
