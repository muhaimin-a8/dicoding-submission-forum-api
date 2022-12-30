const DetailThread = require('../DetailThread');

describe('a DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload1 = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'ini adalah isi thread',
      date: '2021-08-08T07:00:00.000Z',
      username: 'dicoding',
    };
    const payload2 = {
      title: 'sebuah thread',
      body: 'ini adalah isi thread',
      date: '2021-08-08T07:00:00.000Z',
      username: 'dicoding',
    };
    const payload3 = {
      id: 'thread-123',
      body: 'ini adalah isi thread',
      date: '2021-08-08T07:00:00.000Z',
      username: 'dicoding',
    };

    // Action and Assert
    expect(() => new DetailThread(payload1)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new DetailThread(payload2)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new DetailThread(payload3)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 123,
      title: 'sebuah thread',
      body: 'ini adalah isi thread',
      date: '2021-08-08T07:00:00.000Z',
      username: 'dicoding',
      comments: [],
    };

    const payload2 = {
      id: 'thread-123',
      title: {},
      body: 'ini adalah isi thread',
      date: '2021-08-08T07:00:00.000Z',
      username: 'dicoding',
      comments: [],
    };
    const payload3 = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'ini adalah isi thread',
      date: '2021-08-08T07:00:00.000Z',
      username: 'dicoding',
      comments: {},
    };

    // Action and Assert
    expect(() => new DetailThread(payload1)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new DetailThread(payload2)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new DetailThread(payload3)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'ini adalah isi thread',
      date: '2021-08-08T07:00:00.000Z',
      username: 'dicoding',
      comments: [],
    };

    // Action
    const {id, title, body, date, username, comments} = new DetailThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
  });
});
