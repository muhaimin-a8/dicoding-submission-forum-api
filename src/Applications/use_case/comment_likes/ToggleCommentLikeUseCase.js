class ToggleCommentLikeUseCase {
  constructor({commentLikesRepository, threadRepository, commentRepository}) {
    this._commentLikesRepository = commentLikesRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyAvailableThreadById(useCasePayload.threadId);
    await this._commentRepository.verifyCommentIsExistById(useCasePayload.commentId);
    const isLiked = await this._commentLikesRepository.isLiked({
      userId: useCasePayload.userId,
      commentId: useCasePayload.commentId,
    });
    if (isLiked) {
      await this._commentLikesRepository.deleteLike({
        userId: useCasePayload.userId,
        commentId: useCasePayload.commentId,
      });
    } else {
      await this._commentLikesRepository.addLike(
          {
            userId: useCasePayload.userId,
            commentId: useCasePayload.commentId,
          },
      );
    }
  }
}

module.exports = ToggleCommentLikeUseCase;

