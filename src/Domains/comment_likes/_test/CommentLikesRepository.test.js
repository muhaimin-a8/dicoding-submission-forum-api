const ToggleCommentLikeRepository = require('../CommentLikesRepository');

describe('ToggleCommentLikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const toggleCommentLikeRepository = new ToggleCommentLikeRepository();

    // Action and Assert
    await expect(toggleCommentLikeRepository.isLiked({})).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(toggleCommentLikeRepository.addLike({})).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(toggleCommentLikeRepository.deleteLike({})).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
