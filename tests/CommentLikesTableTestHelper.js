/* eslint-disable camelcase */
/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentLikesTableTestHelper = {
  async addLike({
    id = 'comment-likes-123',
    comment_id = 'comment-123',
    user_id = 'user-123',
    created_at = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO user_comment_likes VALUES($1, $2, $3, $4)',
      values: [id, comment_id, user_id, created_at],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM user_comment_likes WHERE 1=1');
  },
};

module.exports = CommentLikesTableTestHelper;
