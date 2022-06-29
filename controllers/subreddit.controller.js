const nanoid = require("nanoid");

const isValidSubreddit = (subreddit) => {
  // subreddit is 4-20 characters long
  // no _ at the beginning and end
  // no __* inside
  // only allows alphanumeric characters and _

  if (/^(?=[a-zA-Z0-9_]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(subreddit)) {
    return true;
  }
  return false;
};

const isValidDescription = (description) => {
  return description.length > 0 && description.length < 255;
};

module.exports = (subredditsRepository) => {
  const subredditController = {
    getAllSubreddits: (req, res) => {
      new Promise((resolve, reject) => {
        subredditsRepository
          .getAllSubreddits()
          .then(resolve)
          .catch(() => {
            reject(res.status(404).json({ error: "No subreddits found." }));
          });
      })
        .then((data) => {
          res.status(200).json(data[0][0]);
        })
        .catch(() => {
          res.status(404).json({ error: { message: "No subreddits found." } });
        });
    },

    // TODO: FIX ERROR HANDLING; CURRENTLY DOES NOT HANDLE IF SUBREDDIT ALREADY EXISTS
    getOneSubreddit: (req, res) => {
      new Promise((resolve, reject) => {
        const subredditId = req.params.subredditId;
        if (subredditId) {
          subredditsRepository
            .getOneSubreddit(subredditId)
            .then((data) => {
              resolve(data);
            })
            .catch(() => {
              reject(
                res
                  .status(404)
                  .json({ error: { message: "Subreddit not found." } })
              );
            });
        } else {
          reject(
            res
              .status(400)
              .json({ error: { messasge: "Invalid/missing parameter." } })
          );
        }
      })
        .then((data) => {
          res.status(200).json(data[0][0][0]);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    // TODO: FIX ERROR HANDLING; CURRENTLY DOES NOT HANDLE IF SUBREDDIT ALREADY EXISTS FOR SOME REASON
    postSubreddit: (req, res) => {
      new Promise((resolve, reject) => {
        const id = nanoid.nanoid();
        const subredditName = req.body.subredditName;
        const description = req.body.description;

        if (subredditName && description) {
          if (isValidSubreddit(subredditName)) {
            if (isValidDescription(description)) {
              subredditsRepository
                .checkIfSubredditExists(subredditName, id)
                .then((data) => {
                  console.log("DATA ", data[0][0][0]);
                  if (data[0][0][0]["COUNT(name)"] === 0) {
                    subredditsRepository
                      .createSubreddit(
                        id,
                        subredditName,
                        description,
                        "https://i.imgur.com/8OLatuA.png",
                        Date.now()
                      )
                      .then(() => {
                        resolve({
                          id: id,
                          subreddit: subredditName,
                          icon: "https://i.imgur.com/8OLatuA.png",
                          description: description,
                        });
                      })
                      .catch(() => {
                        reject(
                          res
                            .status(400)
                            .json({ error: "Subreddit already exists." })
                        );
                      });
                  } else {
                    reject(
                      res
                        .status(400)
                        .json({ error: "Subreddit already exists." })
                    );
                  }
                });
            } else {
              reject(
                res
                  .status(400)
                  .json({ error: "Description must be from 0-255 characters." })
              );
            }
          } else {
            reject({
              status: 400,
              error: { message: "Invalid subreddit name." },
            });
          }
        } else {
          reject({
            status: 404,
            error: { message: "Missing title or description." },
          });
        }
      })
        .then((subredditInfo) => {
          res.status(200).json(subredditInfo);
        })
        .catch((error) => {
          res.status(error.status).json({ error: error.error });
        });
    },

    // TODO: CHANGE IMPLEMENTATION TO ACCEPT BOTH ID AND SUBREDDIT NAME
    putSubreddit: (req, res) => {
      new Promise((resolve, reject) => {
        const description = req.body.description;
        const subredditName = req.params.subreddit;
        if (description) {
          subredditsRepository
            .checkIfSubredditExists(subredditName)
            .then((data) => {
              if (data[0][0][0]["COUNT(name)"] === 0) {
                reject({
                  status: 404,
                  error: { message: "Subreddit not found." },
                });
              } else {
                subredditsRepository
                  .updateSubredditDescription(subredditName, description)
                  .then(() => {
                    resolve({
                      subreddit: subredditName,
                      description: description,
                    });
                  })
                  .catch(() => {
                    reject(
                      res.status(404).json({ message: "Subreddit not found." })
                    );
                  });
              }
            })
            .catch();
        } else {
          reject({
            status: 404,
            error: { message: "Missing description." },
          });
        }
      })
        .then((subredditInfo) => {
          res.status(200).json(subredditInfo);
        })
        .catch((error) => {
          res.status(error.status).json({ error: error.error });
        });
    },
  };
  return subredditController;
};
