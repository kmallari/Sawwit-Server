const nanoid = require("nanoid");

module.exports = (commentsRepository) => {
  const commentController = {
    getAllComments: (req, res) => {
      new Promise((resolve, reject) => {
        commentsRepository
          .getAllComments()
          .then((data) => {
            if (data[0][0].length > 0) {
              resolve(data[0][0]);
            } else {
              reject({
                status: 404,
                error: { message: "Comments not found." },
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

    getPostComments: (req, res) => {
      new Promise((resolve, reject) => {
        const postId = req.params.postId;
        if (postId) {
          commentsRepository
            .checkIfPostExists(postId)
            .then((data) => {
              if (data[0][0][0]["COUNT(id)"] > 0) {
                commentsRepository
                  .getPostComments(postId)
                  .then((data) => {
                    resolve(data[0][0]);
                  })
                  .catch((err) => {
                    reject({
                      status: 500,
                      error: err,
                    });
                  });
              } else {
                reject({
                  status: 404,
                  error: { message: "Post not found." },
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
            error: { message: "Invalid/missing parameter postId" },
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

    postComment: (req, res) => {
      new Promise((resolve, reject) => {
        const postId = req.params.postId;
        const { userId, username, comment, parentId } = req.body;
        const parentLevel = parseInt(req.query.parentLevel);
        console.log("PARENT", typeof parentLevel);
        const id = nanoid.nanoid();

        if (userId && username && comment && parentId) {
          commentsRepository
            .checkIfPostExists(postId)
            .then((data) => {
              if (data[0][0].length > 0) {
                commentsRepository
                  .checkIfUserExists(userId)
                  .then((userData) => {
                    if (userData[0][0].length > 0) {
                      // console.log(userId, username, comment, parentId);
                      console.log(userData[0][0][0]);
                      commentsRepository
                        .createComment(
                          id,
                          userId,
                          username,
                          userData[0][0][0].profilePicture,
                          postId,
                          parentId,
                          comment,
                          Date.now(),
                          parentLevel
                        )
                        .then(() => {
                          resolve({
                            id: id,
                            userId: userId,
                            username: username,
                            postId: postId,
                            parentId: parentId,
                            body: comment,
                            createdAt: Date.now(),
                            level: parentLevel + 1,
                            upvotes: 0,
                            downvotes: 0,
                            childrenCount: 0,
                          });
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
                        status: 404,
                        error: { message: "User not found." },
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
                  status: 404,
                  error: { message: "Post not found." },
                });
              }
            })
            .catch((err) =>
              reject({
                status: 500,
                error: err,
              })
            );
        } else {
          reject({
            status: 400,
            error: { message: "Invalid/missing parameters." },
          });
        }
      })
        .then((data) => {
          res.status(201).json(data);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    getOneComment: (req, res) => {
      new Promise((resolve, reject) => {
        const { commentId } = req.params;
        // probably need a checker if the subreddit also exists
        commentsRepository
          .checkIfCommentExists(commentId)
          .then((data) => {
            if (data[0][0][0]["COUNT(id)"] === 0) {
              reject({ status: 404, error: { message: "Comment not found." } });
            } else {
              commentsRepository
                .getOneComment(commentId)
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
      })
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    getNextComments: (req, res) => {
      new Promise((resolve, reject) => {
        const { parentId } = req.query;
        console.log("HELLO", parentId);

        if (parentId) {
          commentsRepository
            .getNextComments(parentId)
            .then((data) => {
              resolve(data[0][0]);
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

    putComment: (req, res) => {
      new Promise((resolve, reject) => {
        const commentId = req.params.commentId;
        const { comment } = req.body;

        if (commentId && comment) {
          commentsRepository
            .changeComment(commentId, comment)
            .then(() => {
              resolve({
                message: `Successfully edited comment with id: ${id}`,
                id: commentId,
                comment: comment,
              });
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
            error: { message: "Invalid/missing parameter/s." },
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

    deleteComment: (req, res) => {
      // need ng subreddit if exists checker?
      new Promise((resolve, reject) => {
        const commentId = req.params.commentId;
        commentsRepository
          .checkIfCommentExists(commentId)
          .then((data) => {
            if (data[0][0][0]["COUNT(id)"] === 0) {
              reject({
                status: 404,
                error: { message: "Comment not found." },
              });
            } else {
              commentsRepository
                .deleteComment(commentId)
                .then(() => {
                  resolve(commentId);
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
      })
        .then((id) => {
          res.status(200).json({
            message: `Successfully deleted comment with the id of ${id} `,
          });
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },
  };
  return commentController;
};
