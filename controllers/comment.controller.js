const nanoid = require("nanoid");

module.exports = (commentsRepository) => {
  const commentController = {
    getAllComments: (req, res) => {
      new Promise((resolve, reject) => {
        commentsRepository
          .getAllComments()
          .then((data) => {
            resolve(data);
          })
          .catch(() => {
            reject({
              status: 404,
              error: { message: "Comments not found." },
            });
          });
      })
        .then((data) => {
          res.status(200).json(data[0][0]);
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
                    resolve(data);
                  })
                  .catch((err) => {
                    console.log(err);
                    reject({
                      status: 404,
                      error: { message: "Comments not found." },
                    });
                  });
              } else {
                reject({
                  status: 404,
                  error: { message: "Post does not exist." },
                });
              }
            })
            .catch(() => {
              reject({
                status: 404,
                error: { message: "Post does not exist." },
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
          res.status(200).json(data[0][0]);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    postComment: (req, res) => {
      new Promise((resolve, reject) => {
        const postId = req.params.postId;
        const { userId, username, comment, parentId } = req.body;
        const id = nanoid.nanoid();

        if (userId && comment && parentId) {
          commentsRepository
            .checkIfPostExists(postId)
            .then((data) => {
              if (data[0][0][0]["COUNT(id)"] > 0) {
                commentsRepository.checkIfIDExists(userId).then((data) => {
                  if (data[0][0][0]["COUNT(id)"] > 0) {
                    commentsRepository
                      .createComment(
                        id,
                        userId,
                        username,
                        postId,
                        parentId,
                        comment,
                        Date.now()
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
                        });
                      })
                      .catch(() => {
                        reject({
                          status: 500,
                          error: { message: "Internal server error." },
                        });
                      });
                  } else {
                    reject({
                      status: 404,
                      error: { message: "User does not exist." },
                    });
                  }
                });
              } else {
                reject({
                  status: 404,
                  error: { message: "Post does not exist." },
                });
              }
            })
            .catch(() =>
              reject({
                status: 404,
                error: { message: "Post does not exist." },
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
          res.status(200).json(data);
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
            console.log("DATA", data[0][0][0]);
            if (data[0][0][0]["COUNT(id)"] === 0) {
              reject({ status: 404, error: { message: "Comment not found." } });
            } else {
              commentsRepository
                .getOneComment(commentId)
                .then((data) => {
                  resolve(data);
                })
                .catch(() => {
                  reject({
                    status: 500,
                    error: { message: "Internal server error." },
                  });
                });
            }
          })
          .catch(() => {
            reject({
              status: 500,
              error: { message: "Internal server error." },
            });
          });
      })
        .then((data) => {
          res.status(200).json(data[0][0][0]);
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
              resolve({ id: commentId, comment: comment });
            })
            .catch(() => {
              reject({ status: 404, error: { message: "Comment not found." } });
            });
        } else {
          reject({
            status: 400,
            error: { message: "Invalid/missing parameter/s." },
          });
        }
      }).then((data) => {
        res.status(200).json(data);
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
                .catch(() => {
                  reject({
                    status: 404,
                    error: { message: "Comment not found." },
                  });
                });
            }
          })
          .catch(() => {
            reject({
              status: 500,
              error: { message: "Internal server error" },
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
