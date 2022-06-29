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
      subredditId,
      subredditName,
      createdAt
    ) => {
      return knex.raw("CALL createPost(?, ?, ?, ?, ?, ?, ?, ?)", [
        id,
        userId,
        username,
        title,
        body,
        subredditId,
        subredditName,
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
      return knex.raw("CALL CheckIfSubredditExists(?, ?)", [name]);
    },
    checkIfIDExists: (id) => {
      return knex.raw("CALL CheckIfIDExists(?)", [id]);
    },
  };
  return postsRepository;
};
