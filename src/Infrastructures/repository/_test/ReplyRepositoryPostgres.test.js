const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const TheadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');

describe('ReplyRepositoryPostgres', () => {
  it('should be instance of ReplyRepository domain', () => {
    const replyRepositoryPostgres = new ReplyRepositoryPostgres({}, {});

    expect(replyRepositoryPostgres).toBeInstanceOf(ReplyRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await RepliesTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
      await TheadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    beforeEach(async () => {
      await UsersTableTestHelper.addUser({id: 'user-123'});
      await TheadsTableTestHelper.addThread({id: 'thread-123'});
      await CommentsTableTestHelper.addComment({id: 'comment-123'});
    });

    describe('addReply function', () => {
      it('should persist add reply and return added reply correctly', async () => {
        // Arrange
        const addReply = new AddReply({
          content: 'reply content',
          owner: 'user-123',
          comment: 'comment-123',
          thread: 'thread-123',
        });
        const fakeIdGenerator = () => '123';
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const addedReply = await replyRepositoryPostgres.addReply(addReply);

        // Assert
        const replyFinded = await RepliesTableTestHelper.findRepliesById('reply-123');
        expect(addedReply).toStrictEqual(new AddedReply({
          id: 'reply-123',
          content: 'reply content',
          owner: 'user-123',
        }));
        expect(replyFinded).toHaveLength(1);
      });
    });
  });
});
