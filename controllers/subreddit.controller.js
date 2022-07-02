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
          .then((data) => {
            if (data[0][0].length > 0) {
              resolve(data[0][0]);
            } else {
              reject({
                status: 404,
                error: { message: "No subreddits found." },
              });
            }
          })
          .catch(() => {
            reject({
              status: 500,
              error: { message: "Internal server error. (SQL)" },
            });
          });
      })
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    getSubredditInfo: (req, res) => {
      new Promise((resolve, reject) => {
        const subredditName = req.params.subreddit;
        if (subredditName) {
          subredditsRepository
            .getSubredditInfo(subredditName)
            .then((data) => {
              if (data[0][0].length > 0) {
                resolve(data[0][0][0]);
              } else {
                reject({
                  status: 404,
                  error: { message: "Subreddit not found." },
                });
              }
            })
            .catch(() => {
              reject(
                res
                  .status(500)
                  .json({ error: { message: "Internal server error. (SQL)" } })
              );
            });
        } else {
          reject(
            res
              .status(400)
              .json({ error: { message: "Invalid/missing parameter." } })
          );
        }
      })
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    postSubreddit: (req, res) => {
      new Promise((resolve, reject) => {
        const subredditName = req.body.subredditName;
        const description = req.body.description;

        if (subredditName && description) {
          if (isValidSubreddit(subredditName)) {
            if (isValidDescription(description)) {
              subredditsRepository
                .checkIfSubredditExists(subredditName)
                .then((data) => {
                  if (data[0][0][0]["COUNT(name)"] === 0) {
                    subredditsRepository
                      .createSubreddit(
                        subredditName,
                        description,
                        "https://i.imgur.com/8OLatuA.png",
                        Date.now()
                      )
                      .then(() => {
                        resolve({
                          subreddit: subredditName,
                          icon: "https://i.imgur.com/8OLatuA.png",
                          description: description,
                        });
                      })
                      .catch((err) => {
                        console.error(err);
                        reject(
                          res
                            .status(500)
                            .json({ error: "Internal server error. (SQL1)" })
                        );
                      });
                  } else {
                    reject(
                      res
                        .status(409)
                        .json({ error: "Subreddit already exists." })
                    );
                  }
                });
            } else {
              reject(
                res
                  .status(403)
                  .json({ error: "Description must be from 0-255 characters." })
              );
            }
          } else {
            reject({
              status: 403,
              error: { message: "Invalid subreddit name." },
            });
          }
        } else {
          reject({
            status: 404,
            error: { message: "Title or description not found." },
          });
        }
      })
        .then((subredditInfo) => {
          res.status(201).json(subredditInfo);
        })
        .catch((error) => {
          res.status(error.status).json({ error: error.error });
        });
    },

    // TO DO: ADD FEATURE TO BE ABLE TO UPDATE SUBREDDIT ICON
    putSubreddit: (req, res) => {
      new Promise((resolve, reject) => {
        const { subreddit, description } = req.body;
        const subredditId = req.params.subreddit;
        if (description) {
          // BROKEN
          // CAN UPDATE DESCRIPTION BUT SERVER RESPONSES WITH ERROR 500 (SECOND ONE)
          subredditsRepository
            .checkIfSubredditExists(subreddit)
            .then((data) => {
              if (data[0][0][0]["COUNT(name)"] === 0) {
                reject({
                  status: 404,
                  error: { message: "Subreddit not found." },
                });
              } else {
                subredditsRepository
                  .updateSubredditDescription(subredditId, description)
                  .then(() => {
                    resolve({
                      subreddit: subredditId,
                      description: description,
                    });
                  })
                  .catch(() => {
                    reject({
                      status: 500,
                      error: { message: "Internal server error. (SQL)" },
                    });
                  });
              }
            })
            .catch(
              reject({
                status: 500,
                error: { message: "Internal server error. (SQL)" },
              })
            );
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

    searchSubreddit: (req, res) => {
      new Promise((resolve, reject) => {
        const searchTerm = req.query.searchTerm + "%";
        console.log(searchTerm);
        if (searchTerm) {
          subredditsRepository
            .searchSubreddit(searchTerm)
            .then((data) => {
              if (data[0][0].length > 0) {
                resolve(data[0][0]);
              } else {
                reject({
                  status: 404,
                  error: { message: "No subreddits found." },
                });
              }
            })
            .catch(() => {
              reject({
                status: 500,
                error: { message: "Internal server error. (SQL)" },
              });
            });
        } else {
          reject({
            status: 404,
            error: { message: "Missing search term." },
          });
        }
      })
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(error.status).json({ error: error.error });
        });
    },
  };
  return subredditController;
};
