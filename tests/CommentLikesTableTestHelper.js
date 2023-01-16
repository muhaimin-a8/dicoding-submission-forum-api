/* eslint-disable camelcase */
/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentLikesTableTestHelper = {
  async addLike({
    id = 'comment-likes-123',
    comment_id = 'comment-123',
    user_id = 'user-123',
    is_liked = true,
    created_at = new Date(),
    updated_at = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO user_comment_likes VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, comment_id, user_id, is_liked, created_at, updated_at],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM user_comment_likes WHERE 1=1');
  },
};

module.exports = CommentLikesTableTestHelper;
