const CommentLikesRepository = require('../../../../Domains/comment_likes/CommentLikesRepository');
const ToggleCommentLikeUseCase = require('../ToggleCommentLikeUseCase');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');

describe('ToggleCommentLikeUseCase', () => {
  it('should orchestrating the add comment like action correctly when user is liked', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    /** creating dependency of use case */
    const mockCommentLikesRepository = new CommentLikesRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThreadById = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentIsExistById = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentLikesRepository.isLiked = jest.fn().mockImplementation(() => Promise.resolve(true));
    mockCommentLikesRepository.deleteLike = jest.fn().mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      commentLikesRepository: mockCommentLikesRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    // Action
    await toggleCommentLikeUseCase.execute({
      userId: useCasePayload.userId,
      threadId: useCasePayload.threadId,
      commentId: useCasePayload.commentId,
    });

    // Assert
    expect(mockThreadRepository.verifyAvailableThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentIsExistById).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentLikesRepository.isLiked).toBeCalledWith({
      userId: useCasePayload.userId,
      commentId: useCasePayload.commentId,
    });
    expect(mockCommentLikesRepository.deleteLike).toBeCalledWith({
      userId: useCasePayload.userId,
      commentId: useCasePayload.commentId,
    });
  });

  it('should orchestrating the add comment like action correctly when user is not liked', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    /** creating dependency of use case */
    const mockCommentLikesRepository = new CommentLikesRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThreadById = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentIsExistById = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentLikesRepository.isLiked = jest.fn().mockImplementation(() => Promise.resolve(false));
    mockCommentLikesRepository.addLike = jest.fn().mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      commentLikesRepository: mockCommentLikesRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    // Action
    await toggleCommentLikeUseCase.execute(useCasePayload);

    // Assert
    useCasePayload.isLiked = true;
    expect(mockThreadRepository.verifyAvailableThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentIsExistById).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentLikesRepository.isLiked).toBeCalledWith({
      userId: useCasePayload.userId,
      commentId: useCasePayload.commentId,
    });
    expect(mockCommentLikesRepository.addLike).toBeCalledWith({
      userId: useCasePayload.userId,
      commentId: useCasePayload.commentId,
    });
  });
});
