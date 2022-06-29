module.exports = (knex) => {
  const subredditsRepository = {
    getAllSubreddits: () => {
      return knex.raw("CALL GetAllSubreddits()");
    },
    createSubreddit: (id, name, description, icon, createdAt) => {
      return knex.raw("CALL CreateSubreddit(?, ?, ?, ?, ?)", [
        id,
        name,
        description,
        icon,
        createdAt,
      ]);
    },
    checkIfSubredditExists: (name, id) => {
      return knex.raw("CALL CheckIfSubredditExists(?)", [name]);
    },
    getOneSubreddit: (id) => {
      return knex.raw("CALL GetOneSubreddit(?)", [id]);
    },
    updateSubredditDescription: (id, description) => {
      return knex.raw("CALL UpdateSubredditDescription(?, ?)", [
        id,
        description,
      ]);
    },
  };
  return subredditsRepository;
};
