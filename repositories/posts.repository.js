module.exports = (knex) => {
  const postsRepository = {
    getAllPosts: () => {
      return knex.raw("CALL GetAllPosts()");
    },
    getAllPostsFromSubreddit: (subredditName) => {
      return knex.raw("CALL GetPostsFromSubreddit(?)", [subredditName]);
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
      return knex.raw("CALL createPost(?, ?, ?, ?, ?, ?, ?, ?)", [
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
      return knex.raw("CALL CheckIfPostExists(?)", [postId]);
    },
    getOnePost: (postId) => {
      return knex.raw("CALL GetOnePost(?)", [postId]);
    },
    getUserPosts: (userId) => {
      return knex.raw("CALL GetUserPosts(?)", [userId]);
    },
    doesPostExist: (postId) => {
      return knex.raw("CALL DoesPostExist(?)", [postId]);
    },
    deletePost: (postId) => {
      return knex.raw("CALL DeletePost(?)", [postId]);
    },
    updatePostBody: (postId, body) => {
      return knex.raw("CALL UpdatePostBody(?, ?)", [postId, body]);
    },
    checkIfSubredditExists: (name) => {
      return knex.raw("CALL CheckIfSubredditExists(?)", [name]);
    },
    checkIfUserExists: (id) => {
      return knex.raw("CALL CheckIfIDExists(?)", [id]);
    },
    checkIfUserHasVoted: (userId, postId) => {
      return knex.raw("CALL CheckIfUserVotedPost(?, ?)", [userId, postId]);
    },
    votePost: (userId, postId, vote) => {
      return knex.raw("CALL CreatePostVote(?, ?, ?)", [userId, postId, vote]);
    },
    deleteVote: (userId, postId) => {
      return knex.raw("CALL DeletePostVote(?, ?)", [userId, postId]);
    },
    updateVote: (userId, postId, vote) => {
      return knex.raw("CALL UpdatePostVote(?, ?, ?)", [userId, postId, vote]);
    },
  };
  return postsRepository;
};
