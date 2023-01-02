const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');

const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of CommentRepository domain', () => {
    // Arrange
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {});

    // Action & Assert
    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addComment function', () => {
      it('should persist add comment and return added comment correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({id: 'dicoding'});
        await ThreadsTableTestHelper.addThread({id: 'thread-123', owner: 'dicoding'});
        const addComment = new AddComment({
          content: 'comment content',
          thread: 'thread-123',
          owner: 'dicoding',
        });
        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const comment = await commentRepositoryPostgres.addComment(addComment);
        const commentFinded = await CommentsTableTestHelper.findCommentById('comment-123');

        // Assert
        expect(comment).toStrictEqual(new AddedComment({
          id: 'comment-123',
          content: 'comment content',
          owner: 'dicoding',
        }));
        expect(commentFinded).toHaveLength(1);
      });

      it('should throw error when thread not found', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({id: 'dicoding'});
        const addComment = new AddComment({
          content: 'comment content',
          thread: 'thread-123',
          owner: 'dicoding',
        });
        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Action & Assert
        await expect(commentRepositoryPostgres.addComment(addComment)).rejects.toThrowError();
      });

      it('should throw error when user not found', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({id: 'dicoding'});
        await ThreadsTableTestHelper.addThread({id: 'thread-123', owner: 'dicoding'});
        const addComment = new AddComment({
          content: 'comment content',
          thread: 'thread-123',
          owner: 'dicoding-tidak-ada',
        });

        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Action & Assert
        await expect(commentRepositoryPostgres.addComment(addComment)).rejects.toThrowError();
      });
    });
  });
});
