module.exports = (db, redis) => {
  const commentsRepository = {
    getAllComments: () => {
      return db.raw("CALL GetAllComments()");
    },
    createComment: (
      id,
      userId,
      username,
      userProfilePicture,
      postId,
      parentId,
      body,
      createdAt,
      parentLevel
    ) => {
      return db.raw("CALL CreateComment(?, ?, ?, ?, ?, ?, ?, ?, ?)", [
        id,
        userId,
        username,
        userProfilePicture,
        postId,
        parentId,
        body,
        createdAt,
        parentLevel,
      ]);
    },
    getPostComments: (postId) => {
      return db.raw("CALL GetPostComments(?)", [postId]);
    },
    getNextComments: (parentId) => {
      return db.raw("CALL GetNextComments(?)", [parentId]);
    },
    deleteComment: (id) => {
      return db.raw("CALL DeleteComment(?)", [id]);
    },
    getOneComment: (id) => {
      return db.raw("CALL GetOneComment(?)", [id]);
    },
    changeComment: (id, body) => {
      return db.raw("CALL ChangeComment(?, ?)", [id, body]);
    },
    checkIfCommentExists: (id) => {
      return db.raw("CALL CheckIfCommentExists(?)", [id]);
    },
    checkIfPostExists: (postId) => {
      return db.raw("CALL CheckIfPostExists(?)", [postId]);
    },
    checkIfUserExists: (id) => {
      return db.raw("CALL CheckIfIDExists(?)", [id]);
    },
    setParentCommentsToCache: (postId, parentIds) => {
      // kung gumamit ng hset/hash hindi na kailangan mag setParentCommentsToCache sa una
      return redis.set(postId, JSON.stringify(parentIds), 'ex', 5);
    },
    getCommentsFromCache: (postId) => {
      return redis.get(postId);
    },
    clearCachedCommentsForPost: (postId) => {
      return redis.del(postId);
    },
  };
  return commentsRepository;
};
