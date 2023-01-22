const ToggleCommentLikeRepository = require('../../../Domains/comment_likes/CommentLikesRepository');
const CommentLikeRepositoryPostgres = require('../CommentLikesRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('ToggleCommentLikeRepositoryPostgres', () => {
  it('should be instance of ToggleCommentLikeRepositoryPostgres domain', () => {
    // Arrange
    const toggleCommentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres({}, {});

    // Action & Assert
    expect(toggleCommentLikeRepositoryPostgres).toBeInstanceOf(ToggleCommentLikeRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable();
      await CommentLikesTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    beforeEach(async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
    });

    describe('isLiked', () => {
      it('should return true when comment is liked', async () => {
        // Arrange
        await CommentLikesTableTestHelper.addLike({});
        const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

        // Action
        const isLiked = await commentLikeRepositoryPostgres.isLiked({
          commentId: 'comment-123',
          userId: 'user-123',
        });

        // Assert
        expect(isLiked).toBeTruthy();
      });

      it('should return false when comment is not liked', async () => {
        // Arrange
        const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

        // Action
        const isLiked = await commentLikeRepositoryPostgres.isLiked({
          commentId: 'comment-123',
          userId: 'user-123',
        });

        // Assert
        expect(isLiked).toBeFalsy();
      });
    });

    describe('addLike', () => {
      it('should not throw error ', async () => {
        // Arrange
        const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, () => '123');

        // Action & Assert
        await expect(commentLikeRepositoryPostgres.addLike({
          commentId: 'comment-123',
          userId: 'user-123',
        })).resolves.not.toThrowError();
      });
    });

    describe('deleteLike', () => {
      it('should not throw error ', async () => {
        // Arrange
        const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(commentLikeRepositoryPostgres.deleteLike({
          commentId: 'comment-123',
          userId: 'user-123',
        })).resolves.not.toThrowError();
      });
    });

    describe('getLikesCountByCommentId', () => {
      it('should return likes count', async () => {
        // Arrange
        await CommentLikesTableTestHelper.addLike({});
        await CommentLikesTableTestHelper.addLike({id: 'comment-like-321'});
        const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

        // Action
        const likesCount = await commentLikeRepositoryPostgres.getLikesCountByCommentId('comment-123');

        // Assert
        expect(likesCount).toEqual(2);
      });
    });
  });
});
