const GetDetailComment = require('../GetDetailComment');

describe('a GetDetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload1 = {
      id: 'comment-123',
      content: 'comment content',
      username: 'user-123',
      created_at: new Date(),
    };
    const payload2 = {
      content: 'comment content',
      username: 'user-123',
      created_at: new Date(),
      is_deleted: false,
    };
    const payload3 = {
      id: 'comment-123',
      username: 'user-123',
      created_at: new Date(),
      is_deleted: false,
    };

    // Action and Assert
    expect(() => new GetDetailComment(payload1)).toThrowError('GET_DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new GetDetailComment(payload2)).toThrowError('GET_DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new GetDetailComment(payload3)).toThrowError('GET_DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 123,
      content: 'comment content',
      username: 'user-123',
      created_at: new Date(),
      is_deleted: false,
    };
    const payload2 = {
      id: 'comment-123',
      content: 123,
      username: 'user-123',
      created_at: '2022-01-01T07:07:07.070Z',
      is_deleted: false,
    };
    const payload3 = {
      id: 'comment-123',
      content: 'comment content',
      username: 123,
      created_at: 123,
      is_deleted: false,
    };

    // Action and Assert
    expect(() => new GetDetailComment(payload1)).toThrowError('GET_DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new GetDetailComment(payload2)).toThrowError('GET_DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new GetDetailComment(payload3)).toThrowError('GET_DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetDetailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'comment content',
      username: 'user-123',
      created_at: new Date(),
      is_deleted: false,
    };
    const payload2 = {
      id: 'comment-123',
      content: 'comment content',
      username: 'user-123',
      created_at: new Date(),
      is_deleted: true,
    };

    // Action
    const getDetailComment = new GetDetailComment(payload);
    const getDetailComment2 = new GetDetailComment(payload2);

    // Assert
    expect(getDetailComment.id).toEqual(payload.id);
    expect(getDetailComment.content).toEqual(payload.content);
    expect(getDetailComment.username).toEqual(payload.username);
    expect(getDetailComment.date).toEqual(payload.created_at);

    expect(getDetailComment2.id).toEqual(payload2.id);
    expect(getDetailComment2.content).toEqual('**komentar telah dihapus**');
    expect(getDetailComment2.username).toEqual(payload2.username);
    expect(getDetailComment2.date).toEqual(payload2.created_at);
  });
});
