const nanoid = require("nanoid");

const isValidTitle = (title) => {
  return title.length > 0 && title.length <= 300;
};

const isValidPostBody = (body) => {
  return body.length >= 0 && body.length <= 40000;
};

module.exports = (postsRepository) => {
  const postController = {
    getAllPosts: (req, res) => {
      new Promise((resolve, reject) => {
        postsRepository
          .getAllPosts()
          .then((data) => {
            if (data[0][0].length > 0) {
              resolve(data[0][0]);
            } else {
              reject({
                status: 404,
                error: { message: "Posts not found." },
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

    getPostsFromSubreddit: (req, res) => {
      new Promise((resolve, reject) => {
        const subredditName = req.params.subreddit;
        postsRepository
          .getAllPostsFromSubreddit(subredditName)
          .then((data) => {
            if (data[0][0].length > 0) {
              resolve(data[0][0]);
            } else {
              reject({
                status: 404,
                error: { message: "Posts not found." },
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

    getOnePost: (req, res) => {
      new Promise((resolve, reject) => {
        const postId = req.params.postId;
        if (postId) {
          postsRepository
            .checkIfPostExists(postId)
            .then((data) => {
              if (data[0][0][0]["COUNT(id)"] === 0) {
                reject({
                  status: 404,
                  error: { message: "Post not found." },
                });
              } else {
                postsRepository
                  .getOnePost(postId)
                  .then((data) => {
                    resolve(data[0][0][0]);
                  })
                  .catch(() => {
                    reject({
                      status: 500,
                      error: { message: "Internal server error. (SQL)" },
                    });
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
            status: 400,
            error: { message: "Invalid/missing post ID." },
          });
        }
      })
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    getUserPosts: (req, res) => {
      new Promise((resolve, reject) => {
        const userId = req.params.userId;
        if (userId) {
          postsRepository
            .checkIfIDExists(userId)
            .then((data) => {
              if (data[0][0][0]["COUNT(id)"] === 0) {
                reject({ status: 404, error: { message: "User not found." } });
              } else {
                postsRepository
                  .getUserPosts(userId)
                  .then((data) => {
                    resolve(data[0][0]);
                  })
                  .catch(() => {
                    reject({
                      status: 500,
                      error: { message: "Internal server error. (SQL)" },
                    });
                  });
              }
            })
            .catch(() => {
              reject({
                status: 500,
                error: { message: "Internal server error . (SQL)" },
              });
            });
        } else {
          reject({
            status: 400,
            error: { message: "Invalid/missing user ID." },
          });
        }
      })
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    postPost: (req, res) => {
      new Promise((resolve, reject) => {
        const { title, body, userId, username, subredditId, subreddit } =
          req.body;

        // no need to include body in if statement since body is optional
        if (title && userId && username && subreddit && subredditId) {
          if (isValidTitle(title)) {
            if (isValidPostBody(body)) {
              postsRepository
                .checkIfSubredditExists(subreddit)
                .then((data) => {
                  if (data[0][0][0]["COUNT(name)"] === 0) {
                    reject({
                      status: 404,
                      error: { message: "Subreddit not found." },
                    });
                  } else {
                    postsRepository
                      .checkIfIDExists(userId)
                      .then((data) => {
                        if (data[0][0][0]["COUNT(id)"] === 0) {
                          reject({
                            status: 404,
                            error: { message: "User not found." },
                          });
                        } else {
                          const id = nanoid.nanoid();
                          postsRepository
                            .createPost(
                              id,
                              userId,
                              username,
                              title,
                              body,
                              subredditId,
                              subreddit,
                              Date.now()
                            )
                            .then(() => {
                              resolve({
                                id: id,
                                userId: userId,
                                username: username,
                                title: title,
                                body: body,
                                subredditId: subredditId,
                                subreddit: subreddit,
                              });
                            })
                            .catch((error) => {
                              console.log(error);
                              reject({
                                status: 500,
                                error: {
                                  message: "Internal server error. (SQL)",
                                },
                              });
                            });
                        }
                      })
                      .catch(() => {
                        reject({
                          status: 500,
                          error: { message: "Internal server error. (SQL)" },
                        });
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
                status: 400,
                error: { message: "Post body must have 0-40000 characters." },
              });
            }
          } else {
            reject({
              status: 400,
              error: { message: "Title must have 0-100 characters." },
            });
          }
        } else {
          reject({
            status: 400,
            error: { message: "Invalid/missing parameters." },
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

    putPost: (req, res) => {
      new Promise((resolve, reject) => {
        const { message } = req.body;
        const postId = req.params.postId;

        if (message && postId) {
          postsRepository
            .checkIfPostExists(postId)
            .then((data) => {
              if (data[0][0][0]["COUNT(id)"] === 0) {
                reject({
                  status: 404,
                  error: { message: "Post not found." },
                });
              } else {
                postsRepository
                  .updatePostBody(postId, message)
                  .then(() => {
                    resolve({
                      id: postId,
                      body: message,
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
            .catch(() => {
              reject({
                status: 500,
                error: { message: "Internal server error. (SQL)" },
              });
            });
        } else {
          reject({
            status: 400,
            error: { message: "Invalid/missing parameters." },
          });
        }
      })
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    deletePost: (req, res) => {
      new Promise((resolve, reject) => {
        const postId = req.params.postId;
        if (postId) {
          postsRepository
            .doesPostExist(postId)
            .then((data) => {
              if (data[0][0][0]["COUNT(id)"] === 0) {
                reject({
                  status: 404,
                  error: { message: "Post not found." },
                });
              } else {
                postsRepository
                  .deletePost(postId)
                  .then(() => {
                    resolve(postId);
                  })
                  .catch(() => {
                    reject({
                      status: 404,
                      error: { message: "Post not found." },
                    });
                  });
              }
            })
            .catch(() => {
              reject({
                status: 404,
                error: { message: "Post not found." },
              });
            });
        } else {
          reject({
            status: 400,
            error: { message: "Missing/Invalid parameters" },
          });
        }
      })
        .then((postId) => {
          res.status(200).json({
            message: `Successfully deleted post with the id of ${postId}`,
          });
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },
  };
  return postController;
};
