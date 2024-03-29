/* eslint-disable camelcase */
class GetDetailThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const {id, title, body, username, created_at} = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.username = username;
    this.date = created_at;
  }
  _verifyPayload({id, title, body, username, created_at}) {
    if (!id || !title || !body || !username || !created_at) {
      throw new Error('GET_DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof username !== 'string' || !(created_at instanceof Date)) {
      throw new Error('GET_DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetDetailThread;
