const GetDetailReply = require('../GetDetailReply');

describe('a GetDetailReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload1 = {
      id: 'reply-123',
      content: 'reply content',
      username: 'user-123',
      updated_at: new Date(),
    };
    const payload2 = {
      content: 'reply content',
      username: 'user-123',
      updated_at: new Date(),
      is_deleted: false,
    };
    const payload3 = {
      id: 'reply-123',
      username: 'user-123',
      updated_at: new Date(),
      is_deleted: false,
    };

    // Action and Assert
    expect(() => new GetDetailReply(payload1)).toThrowError('GET_DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new GetDetailReply(payload2)).toThrowError('GET_DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new GetDetailReply(payload3)).toThrowError('GET_DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 123,
      content: 'reply content',
      username: 'user-123',
      updated_at: '2022-01-01T07:07:07.070Z',
      is_deleted: false,
    };
    const payload2 = {
      id: 'reply-123',
      content: 123,
      username: 'user-123',
      updated_at: new Date(),
      is_deleted: false,
    };
    const payload3 = {
      id: 'reply-123',
      content: 'reply content',
      username: 123,
      updated_at: 123,
      is_deleted: false,
    };

    // Action and Assert
    expect(() => new GetDetailReply(payload1)).toThrowError('GET_DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new GetDetailReply(payload2)).toThrowError('GET_DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new GetDetailReply(payload3)).toThrowError('GET_DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetDetailComment object correctly', () => {
    // Arrange
    const payload1 = {
      id: 'reply-123',
      content: 'reply content',
      username: 'user-123',
      updated_at: new Date(),
      is_deleted: false,
    };
    const payload2 = {
      id: 'reply-123',
      content: 'reply content',
      username: 'user-123',
      updated_at: new Date(),
      is_deleted: true,
    };

    // Action
    const getDetailReply1 = new GetDetailReply(payload1);
    const getDetailReply2 = new GetDetailReply(payload2);

    // Assert
    expect(getDetailReply1.id).toEqual(payload1.id);
    expect(getDetailReply1.content).toEqual(payload1.content);
    expect(getDetailReply1.username).toEqual(payload1.username);
    expect(getDetailReply1.date).toEqual(payload1.updated_at);

    expect(getDetailReply2.id).toEqual(payload2.id);
    expect(getDetailReply2.content).toEqual('**balasan telah dihapus**');
    expect(getDetailReply2.username).toEqual(payload2.username);
    expect(getDetailReply2.date).toEqual(payload2.updated_at);
  });
});
