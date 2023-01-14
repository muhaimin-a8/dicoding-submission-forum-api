/* eslint-disable camelcase */
class GetDetailReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {id, content, username, created_at, is_deleted} = payload;

    this.id = id;
    this.content = (!is_deleted) ? content : '**balasan telah dihapus**';
    this.username = username;
    this.date = created_at;
  }
  _verifyPayload({id, content, username, created_at, is_deleted}) {
    if (!id || !content || !username || !created_at || is_deleted === undefined) {
      throw new Error('GET_DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof username !== 'string' || !(created_at instanceof Date) || typeof is_deleted !== 'boolean') {
      throw new Error('GET_DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetDetailReply;
