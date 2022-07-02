module.exports = (knex) => {
  const subredditsRepository = {
    getAllSubreddits: () => {
      return knex.raw("CALL GetAllSubreddits()");
    },
    createSubreddit: (name, description, icon, createdAt) => {
      return knex.raw("CALL CreateSubreddit(?, ?, ?, ?)", [
        name,
        description,
        icon,
        createdAt,
      ]);
    },
    checkIfSubredditExists: (name) => {
      return knex.raw("CALL CheckIfSubredditExists(?)", [name]);
    },
    getSubredditInfo: (name) => {
      return knex.raw("CALL GetSubredditInfo(?)", [name]);
    },
    updateSubredditDescription: (name, description) => {
      return knex.raw("CALL UpdateSubredditDescription(?, ?)", [
        name,
        description,
      ]);
    },
    searchSubreddit: (name) => {
      return knex.raw("CALL SearchSubreddit(?)", [name]);
    },
  };
  return subredditsRepository;
};
