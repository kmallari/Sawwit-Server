module.exports = (db) => {
  const postsRepository = {
    getAllPosts: () => {
      return db.raw("CALL GetAllPosts()");
    },
    getAllPostsFromSubreddit: (subredditName) => {
      return db.raw("CALL GetPostsFromSubreddit(?)", [subredditName]);
    },
    createPost: (
      id,
      userId,
      username,
      title,
      body,
      subredditName,
      subredditIcon,
      createdAt
    ) => {
      return db.raw("CALL createPost(?, ?, ?, ?, ?, ?, ?, ?)", [
        id,
        userId,
        username,
        title,
        body,
        subredditName,
        subredditIcon,
        createdAt,
      ]);
    },
    checkIfPostExists: (postId) => {
      return db.raw("CALL CheckIfPostExists(?)", [postId]);
    },
    getOnePost: (postId) => {
      return db.raw("CALL GetOnePost(?)", [postId]);
    },
    getUserPosts: (userId) => {
      return db.raw("CALL GetUserPosts(?)", [userId]);
    },
    doesPostExist: (postId) => {
      return db.raw("CALL DoesPostExist(?)", [postId]);
    },
    deletePost: (postId) => {
      return db.raw("CALL DeletePost(?)", [postId]);
    },
    updatePostBody: (postId, body) => {
      return db.raw("CALL UpdatePostBody(?, ?)", [postId, body]);
    },
    checkIfSubredditExists: (name) => {
      return db.raw("CALL CheckIfSubredditExists(?)", [name]);
    },
    checkIfUserExists: (id) => {
      return db.raw("CALL CheckIfIDExists(?)", [id]);
    },
    checkIfUserHasVoted: (userId, postId) => {
      return db.raw("CALL CheckIfUserVotedPost(?, ?)", [userId, postId]);
    },
    votePost: (userId, postId, vote) => {
      return db.raw("CALL CreatePostVote(?, ?, ?)", [userId, postId, vote]);
    },
    deleteVote: (userId, postId, vote) => {
      return db.raw("CALL DeletePostVote(?, ?, ?)", [userId, postId, vote]);
    },
    updateVote: (userId, postId, vote) => {
      return db.raw("CALL UpdatePostVote(?, ?, ?)", [userId, postId, vote]);
    },
  };
  return postsRepository;
};
