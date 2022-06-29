module.exports = (knex) => {
  const subscriptionsRepository = {
    subscribeToSubreddit: (userId, subredditId, createdAt) => {
      return knex.raw("CALL Subscribe(?, ?, ?)", [
        userId,
        subredditId,
        createdAt,
      ]);
    },
    unsubscribeFromSubreddit: (userId, subredditId, createdAt) => {
      return knex.raw("CALL Unsubscribe(?, ?, ?)", [
        userId,
        subredditId,
        createdAt,
      ]);
    },
    getSubscriptions: (userId) => {
      return knex.raw("CALL GetSubscriptions(?)", [userId]);
    },
  };
  return subscriptionsRepository;
};
