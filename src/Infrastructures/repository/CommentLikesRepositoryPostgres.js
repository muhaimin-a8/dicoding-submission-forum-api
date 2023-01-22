const CommentLikeRepository = require('../../Domains/comment_likes/CommentLikesRepository');
class CommentLikesRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async isLiked({commentId, userId}) {
    const query = {
      text: 'SELECT * FROM user_comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };
    const result = await this._pool.query(query);

    return result.rowCount > 0;
  }

  async addLike({commentId, userId}) {
    const id = `comment-like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO user_comment_likes VALUES($1, $2, $3)',
      values: [id, commentId, userId],
    };

    await this._pool.query(query);
  }

  async deleteLike({commentId, userId}) {
    const query = {
      text: 'DELETE FROM user_comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    await this._pool.query(query);
  }

  async getLikesCountByCommentId(commentId) {
    const query = {
      text: 'SELECT id FROM user_comment_likes WHERE comment_id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    return result.rowCount;
  }
}

module.exports = CommentLikesRepositoryPostgres;
