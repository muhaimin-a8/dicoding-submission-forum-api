const AddReplyUseCase = require('../../../../Applications/use_case/replies/AddReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const useCasePayload = {
      content: request.payload.content,
      owner: request.auth.credentials.id,
      thread: request.params.threadId,
      comment: request.params.commentId,
    };
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    return h.response({
      status: 'success',
      data: {
        addedReply,
      },
    }).code(201);
  }
}

module.exports = RepliesHandler;
