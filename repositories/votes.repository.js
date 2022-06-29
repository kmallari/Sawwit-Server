module.exports = (knex) => {
  const votesRepository = {
    checkIfUserVotedPost: (userId, postId) => {
      return knex.raw("CALL CheckIfUserVotedPost(?, ?)", [userId, postId]);
    },
    checkIfUserVotedComment: (userId, commentId) => {
      return knex.raw("CALL CheckIfUserVotedComment(?, ?)", [
        userId,
        commentId,
      ]);
    },
    createPostVote: (userId, postId, vote) => {
      return knex.raw("CALL CreatePostVote(?, ?, ?)", [userId, postId, vote]);
    },
    createCommentVote: (userId, commentId, vote) => {
      return knex.raw("CALL CreateCommentVote(?, ?, ?)", [
        userId,
        commentId,
        vote,
      ]);
    },
  };
  return votesRepository;
};
