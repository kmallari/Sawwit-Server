module.exports = (knex) => {
  const commentsRepository = {
    getAllComments: () => {
      return knex.raw("CALL GetAllComments()");
    },
    createComment: (
      id,
      userId,
      username,
      postId,
      parentId,
      body,
      createdAt,
      parentLevel
    ) => {
      return knex.raw("CALL CreateComment(?, ?, ?, ?, ?, ?, ?, ?)", [
        id,
        userId,
        username,
        postId,
        parentId,
        body,
        createdAt,
        parentLevel,
      ]);
    },
    getPostComments: (postId) => {
      return knex.raw("CALL GetPostComments(?)", [postId]);
    },
    getNextComments: (parentId) => {
      return knex.raw("CALL GetNextComments(?)", [parentId]);
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
