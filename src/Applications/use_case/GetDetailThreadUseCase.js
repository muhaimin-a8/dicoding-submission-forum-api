class GetDetailThreadUseCase {
  constructor({threadRepository, commentRepository}) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThreadById(threadId);
    const thread = await this._threadRepository.getDetailThreadById(threadId);
    const comments = await this._commentRepository.getDetailCommentsByThreadId(threadId);
    return {...thread, comments};
  }
}

module.exports = GetDetailThreadUseCase;

