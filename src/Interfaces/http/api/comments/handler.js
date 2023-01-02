const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

    const addedComment = await addCommentUseCase.execute({
      content: request.payload.content,
      thread: request.params.threadId,
      owner: request.auth.credentials.id,
    });

    return h.response({
      status: 'success',
      data: {
        addedComment,
      },
    }).code(201);
  }
}

module.exports = CommentsHandler;
