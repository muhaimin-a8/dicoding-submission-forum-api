const container = require('../../container');
const createServer = require('../createServer');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');

describe(' /threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and persisted comment like', async () => {
      // Arrange
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
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
        payload: {
          title: 'new thread',
          body: 'new thread body',
        },
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });
      const responseAddThreadJson = JSON.parse(responseAddThread.payload);
      /* adding comment */
      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${responseAddThreadJson.data.addedThread.id}/comments`,
        payload: {
          content: 'new comment',
        },
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });
      const responseAddCommentJson = JSON.parse(responseAddComment.payload);

      /* adding comment like */
      const responseAddCommentLike = await server.inject({
        method: 'PUT',
        url: `/threads/${responseAddThreadJson.data.addedThread.id}/comments/${responseAddCommentJson.data.addedComment.id}/likes`,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });
      const responseAddCommentLikeJson = JSON.parse(responseAddCommentLike.payload);

      // Assert
      expect(responseAddCommentLike.statusCode).toEqual(200);
      expect(responseAddCommentLikeJson.status).toEqual('success');
    });
  });
});
