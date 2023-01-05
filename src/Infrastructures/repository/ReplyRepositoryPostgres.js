const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply) {
    const {content, owner, comment} = addReply;
    const id = `reply-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, comment, owner],
    };

    const result = await this._pool.query(query);

    return new AddedReply({...result.rows[0]});
  }

  async verifyAvailableReplyById(id) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND is_deleted = false',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Reply tidak ditemukan');
    }
  }

  async verifyReplyOwner({id, owner}) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async softDeleteReplyById(id) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE replies SET (is_deleted, updated_at) = (true, $1) WHERE id = $2',
      values: [updatedAt, id],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
