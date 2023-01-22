class GetDetailThreadUseCase {
  constructor({threadRepository, commentRepository, replyRepository, commentLikesRepository}) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._commentLikesRepository = commentLikesRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThreadById(threadId);
    const thread = await this._threadRepository.getDetailThreadById(threadId);
    const commentsNotMapped = await this._commentRepository.getDetailCommentsByThreadId(threadId);
    const comments = commentsNotMapped.map((comment) => {
      return {...comment};
    });
    const result = {
      ...thread,
      comments,
    };

    for (let i = 0; i < result.comments.length; i++) {
      const repliesNotMapped = await this._replyRepository.getDetailReplyByCommentId(result.comments[i].id);
      result.comments[i].replies = repliesNotMapped.map((reply) => {
        return {...reply};
      });
      result.comments[i].likeCount = await this._commentLikesRepository.getLikesCountByCommentId(result.comments[i].id);
    }
    return result;
  }
}

module.exports = GetDetailThreadUseCase;

