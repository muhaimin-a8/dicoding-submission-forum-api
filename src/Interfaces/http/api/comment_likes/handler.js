const ToggleCommentLikeUseCase = require('../../../../Applications/use_case/comment_likes/ToggleCommentLikeUseCase');


class CommentLikesHandler {
  constructor(container) {
    this._container = container;

    this.putToggleCommentLike = this.putToggleCommentLike.bind(this);
  }

  async putToggleCommentLike(request, h) {
    const toggleCommentLikeUseCase = this._container.getInstance(ToggleCommentLikeUseCase.name);
    const useCasePayload = {
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      userId: request.auth.credentials.id,
    };

    await toggleCommentLikeUseCase.execute(useCasePayload);

    return h.response({
      status: 'success',
    }).code(200);
  }
}

module.exports = CommentLikesHandler;
