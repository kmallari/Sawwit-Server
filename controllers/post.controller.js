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
          .catch((err) => {
            reject({
              status: 500,
              error: err,
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
            console.log(data[0][0]);
            if (data[0][0].length > 0) {
              resolve(data[0][0]);
            } else {
              reject({
                status: 404,
                error: { message: "Posts not found." },
              });
            }
          })
          .catch((err) => {
            reject({
              status: 500,
              error: err,
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
                  .catch((err) => {
                    reject({
                      status: 500,
                      error: err,
                    });
                  });
              }
            })
            .catch((err) => {
              reject({
                status: 500,
                error: err,
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
            .checkIfUserExists(userId)
            .then((data) => {
              if (data[0][0].length === 0) {
                reject({ status: 404, error: { message: "User not found." } });
              } else {
                postsRepository
                  .getUserPosts(userId)
                  .then((data) => {
                    resolve(data[0][0]);
                  })
                  .catch((err) => {
                    reject({
                      status: 500,
                      error: err,
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
        const { title, body, userId, username, subreddit } = req.body;

        // no need to include body in if statement since body is optional
        if (title && userId && username && subreddit) {
          if (isValidTitle(title)) {
            if (isValidPostBody(body)) {
              postsRepository
                .checkIfSubredditExists(subreddit)
                .then((subredditData) => {
                  console.log("subreddit data: ", subredditData[0][0][0].icon);
                  if (subredditData[0][0].length === 0) {
                    reject({
                      status: 404,
                      error: { message: "Subreddit not found." },
                    });
                  } else {
                    postsRepository
                      .checkIfUserExists(userId)
                      .then((userData) => {
                        if (userData[0][0].length === 0) {
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
                              subreddit,
                              subredditData[0][0][0].icon,
                              Date.now()
                            )
                            .then(() => {
                              resolve({
                                id: id,
                                userId: userId,
                                username: username,
                                title: title,
                                body: body,
                                subreddit: subreddit,
                                subredditIcon: subredditData[0][0][0].icon,
                              });
                            })
                            .catch((err) => {
                              reject({
                                status: 500,
                                error: err,
                              });
                            });
                        }
                      })
                      .catch((err) => {
                        reject({
                          status: 500,
                          error: err,
                        });
                      });
                  }
                })
                .catch((err) => {
                  console.error(err);
                  reject({
                    status: 500,
                    error: err,
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
                  .catch((err) => {
                    reject({
                      status: 500,
                      error: err,
                    });
                  });
              }
            })
            .catch((err) => {
              reject({
                status: 500,
                error: err,
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

    votePost: (req, res) => {
      new Promise((resolve, reject) => {
        const postId = req.params.postId;
        const { userId, vote } = req.body;
        if (postId && userId && vote) {
          if (vote > 1 || vote < -1) {
            reject({
              status: 400,
              error: { message: "Invalid vote." },
            });
          } else {
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
                    .checkIfUserExists(userId)
                    .then((data) => {
                      if (data[0][0].length === 0) {
                        reject({
                          status: 404,
                          error: { message: "User not found." },
                        });
                      } else {
                        postsRepository
                          .checkIfUserHasVoted(userId, postId)
                          .then((data) => {
                            console.log("DATA!", data[0][0]);
                            if (data[0][0].length === 0) {
                              postsRepository
                                .votePost(userId, postId, vote)
                                .then(() => {
                                  resolve({
                                    id: postId,
                                    userId: userId,
                                    vote: vote,
                                  });
                                })
                                .catch(() => {
                                  reject({
                                    status: 500,
                                    error: {
                                      message: "Internal server error. (SQL1)",
                                    },
                                  });
                                });
                            } else {
                              if (data[0][0][0].vote === vote) {
                                postsRepository
                                  .deleteVote(userId, postId)
                                  .then(() => {
                                    resolve({
                                      id: postId,
                                      userId: userId,
                                      vote: vote,
                                    });
                                  })
                                  .catch(() => {
                                    reject({
                                      status: 500,
                                      error: {
                                        message:
                                          "Internal server error. (SQL5)",
                                      },
                                    });
                                  });
                              } else {
                                postsRepository
                                  .updateVote(userId, postId, vote)
                                  .then(() => {
                                    resolve({
                                      id: postId,
                                      userId: userId,
                                      vote: vote,
                                    });
                                  })
                                  .catch((err) => {
                                    console.error(err);
                                    reject({
                                      status: 500,
                                      error: {
                                        message:
                                          "Internal server error. (SQL6)",
                                      },
                                    });
                                  });
                              }
                            }
                          })
                          .catch((err) => {
                            console.log(err);
                            reject({
                              status: 500,
                              error: {
                                message: "Internal server error. (SQL2)",
                              },
                            });
                          });
                      }
                    })
                    .catch((err) => {
                      console.error("ERROR", err);
                      reject({
                        status: 500,
                        error: err,
                      });
                    });
                }
              })
              .catch((err) => {
                reject({
                  status: 500,
                  error: err,
                });
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
          res.status(error.status).json(error.error);
        });
    },
  };
  return postController;
};
