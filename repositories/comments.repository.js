module.exports = (knex) => {
  const commentsRepository = {
    getAllComments: () => {
      return knex.raw("CALL GetAllComments()");
    },
    createComment: (id, userId, postId, parentId, body, createdAt) => {
      return knex.raw("CALL CreateComment(?, ?, ?, ?, ?, ?, ?)", [
        id,
        userId,
        username,
        postId,
        parentId,
        body,
        createdAt,
      ]);
    },
    getPostComments: (postId) => {
      return knex.raw("CALL GetPostComments(?)", [postId]);
    },
    deleteComment: (id) => {
      return knex.raw("CALL DeleteComment(?)", [id]);
    },
    getOneComment: (id) => {
      return knex.raw("CALL GetOneComment(?)", [id]);
    },
    changeComment: (id, body) => {
      return knex.raw("CALL ChangeComment(?, ?)", [id, body]);
    },
    checkIfCommentExists: (id) => {
      return knex.raw("CALL CheckIfCommentExists(?)", [id]);
    },
    checkIfPostExists: (postId) => {
      return knex.raw("CALL CheckIfPostExists(?)", [postId]);
    },
    checkIfIDExists: (id, username) => {
      return knex.raw("CALL CheckIfIDExists(?)", [id]);
    },
  };
  return commentsRepository;
};
