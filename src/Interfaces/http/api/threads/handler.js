const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const {id: owner} = request.auth.credentials;
    const useCasePayload = {
      title: request.payload.title,
      body: request.payload.body,
      owner,
    };

    const addedThread = await addThreadUseCase.execute(useCasePayload);

    return h.response({
      status: 'success',
      data: {
        addedThread,
      },
    }).code(201);
  }
}

module.exports = ThreadsHandler;
