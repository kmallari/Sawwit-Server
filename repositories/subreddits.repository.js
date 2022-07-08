module.exports = (db) => {
  const subredditsRepository = {
    getAllSubreddits: () => {
      return db.raw("CALL GetAllSubreddits()");
    },
    createSubreddit: (name, description, icon, createdAt) => {
      return db.raw("CALL CreateSubreddit(?, ?, ?, ?)", [
        name,
        description,
        icon,
        createdAt,
      ]);
    },
    checkIfSubredditExists: (name) => {
      return db.raw("CALL CheckIfSubredditExists(?)", [name]);
    },
    getSubredditInfo: (name) => {
      return db.raw("CALL GetSubredditInfo(?)", [name]);
    },
    updateSubredditDescription: (name, description) => {
      return db.raw("CALL UpdateSubredditDescription(?, ?)", [
        name,
        description,
      ]);
    },
    searchSubreddit: (name) => {
      return db.raw("CALL SearchSubreddit(?)", [name]);
    },
  };
  return subredditsRepository;
};
