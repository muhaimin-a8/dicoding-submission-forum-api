const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');
describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestAddThreadPayload = {
        title: 'new thread',
        body: 'new thread body',
      };
      const requestAddCommentPayload = {};
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
      const responseAddThreadJson = JSON.parse(responseAddThread.payload);
      /* adding comment */
      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${responseAddThreadJson.data.addedThread.id}/comments`,
        payload: requestAddCommentPayload,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseAddCommentJson = JSON.parse(responseAddComment.payload);
      expect(responseAddComment.statusCode).toEqual(400);
      expect(responseAddCommentJson.status).toEqual('fail');
      expect(responseAddCommentJson.message).toBeDefined();
      expect(responseAddCommentJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestAddThreadPayload = {
        title: 'new thread',
        body: 'new thread body',
      };
      const requestAddCommentPayload = {
        content: 123,
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
      const responseAddThreadJson = JSON.parse(responseAddThread.payload);
      /* adding comment */
      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${responseAddThreadJson.data.addedThread.id}/comments`,
        payload: requestAddCommentPayload,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseAddCommentJson = JSON.parse(responseAddComment.payload);
      expect(responseAddComment.statusCode).toEqual(400);
      expect(responseAddCommentJson.status).toEqual('fail');
      expect(responseAddCommentJson.message).toBeDefined();
      expect(responseAddCommentJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    });

    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestAddThreadPayload = {
        title: 'new thread',
        body: 'new thread body',
      };
      const requestAddCommentPayload = {
        content: 'new comment',
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
      const responseAddThreadJson = JSON.parse(responseAddThread.payload);
      /* adding comment */
      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${responseAddThreadJson.data.addedThread.id}/comments`,
        payload: requestAddCommentPayload,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseAddCommentJson = JSON.parse(responseAddComment.payload);
      expect(responseAddComment.statusCode).toEqual(201);
      expect(responseAddCommentJson.status).toEqual('success');
      expect(responseAddCommentJson.data).toBeDefined();
      expect(responseAddCommentJson.data.addedComment).toBeDefined();
      expect(responseAddCommentJson.data.addedComment.id).toBeDefined();
      expect(responseAddCommentJson.data.addedComment.content).toEqual(requestAddCommentPayload.content);
      expect(responseAddCommentJson.data.addedComment.owner).toBeDefined();
    });
  });
});
