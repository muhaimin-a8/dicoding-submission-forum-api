const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const GetDetailThread = require('../../../../Domains/threads/entities/GetDetailThread');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const GetDetailComment = require('../../../../Domains/comments/entities/GetDetailComment');
const GetDetailReply = require('../../../../Domains/replies/entities/GetDetailReply');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the get detail thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const date = new Date();

    /* create dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new CommentRepository();
    /* mock needed function */
    mockThreadRepository.verifyAvailableThreadById = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.getDetailThreadById = jest.fn(() => Promise.resolve(new GetDetailThread({
      id: threadId,
      title: 'thread title',
      body: 'thread body',
      username: 'user-123',
      created_at: date,
    })));
    mockCommentRepository.getDetailCommentsByThreadId = jest.fn(() => Promise.resolve([new GetDetailComment({
      id: commentId,
      content: 'comment content',
      username: 'user-123',
      created_at: date,
      is_deleted: false,
    })]));
    mockReplyRepository.getDetailReplyByCommentId = jest.fn(() => Promise.resolve([new GetDetailReply({
      id: 'reply-123',
      content: 'reply content',
      username: 'user-123',
      created_at: date,
      is_deleted: false,
    })]));

    /* create use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const detailThread = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(detailThread).toStrictEqual({
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      username: 'user-123',
      date: date,
      comments: [{
        id: 'comment-123',
        content: 'comment content',
        username: 'user-123',
        date: date,
        replies: [{
          id: 'reply-123',
          content: 'reply content',
          username: 'user-123',
          date: date,
        }],
      }],
    });
    expect(mockThreadRepository.verifyAvailableThreadById).toBeCalledWith(threadId);
    expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getDetailCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getDetailReplyByCommentId).toBeCalledWith(commentId);
  });
});
