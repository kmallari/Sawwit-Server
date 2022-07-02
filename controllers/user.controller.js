// we don't see numbered pagination; every time we scroll then we load another page; think about not returning all the posts in a subreddit, for example
// add error mappings for errors
// move patch requests to body

const nanoid = require("nanoid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 5;

const isValidUsername = (username) => {
  // username is 4-20 characters long
  // no _ at the beginning and end
  // no __* inside
  // only allows alphanumeric characters and _

  if (/^(?=[a-zA-Z0-9_]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(username)) {
    return true;
  }
  return false;
};

const isValidEmail = (email) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  return false;
};

// function for  checking if password is valid using regex
const isValidPassword = (password) => {
  if (
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/.test(password)
  ) {
    return true;
  } else {
    return false;
  }
};

module.exports = (usersRepository) => {
  const userController = {
    getAllUsers: (req, res) => {
      new Promise((resolve, reject) => {
        usersRepository.getAllUsers().then((data) => {
          if (data[0][0].length == 0) {
            reject({
              status: 404,
              error: { message: "No users found" },
            });
          } else {
            resolve(data[0][0]);
          }
        });
      })
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    registerUser: (req, res) => {
      new Promise((resolve, reject) => {
        const { email, username, password } = req.body;
        const id = nanoid.nanoid();

        // sync notes:
        // if walang way to wait for db operation, minsan kahit ibalik na lang
        // yung pinass na parameters

        usersRepository.checkIfUserExists(username).then((data) => {
          if (data[0][0][0]["COUNT(username)"] > 0) {
            // baka pwedeng gawing function sa user repo
            reject({
              status: 409,
              error: { message: "Username is taken." },
            });
          } else {
            usersRepository.checkIfEmailExists(email).then((data) => {
              if (data[0][0][0]["COUNT(email)"] > 0) {
                reject({
                  status: 409,
                  error: { message: "Email is taken." },
                });
              } else {
                if (email && username && password) {
                  // dapat nasa taas
                  if (
                    isValidEmail(email) &&
                    isValidUsername(username) &&
                    isValidPassword(password)
                  ) {
                    bcrypt.genSalt(saltRounds, (err, salt) => {
                      bcrypt.hash(password, salt, (err, hash) => {
                        const now = Date.now();
                        usersRepository
                          .registerUser(
                            id,
                            username,
                            email,
                            hash,
                            "https://i.imgur.com/lccuiDX.png",
                            now
                          )
                          .then(() => {
                            const user = {
                              id: id,
                              username: username,
                              email: email,
                              profilePicture: "https://i.imgur.com/lccuiDX.png",
                              created_at: now,
                            };
                            const token = jwt.sign({ data: user }, "secret");
                            resolve({ data: user, token: token });
                          })
                          .catch((error) => {
                            reject(error);
                          });
                      });
                    });
                  } else {
                    reject({
                      status: 400,
                      error: {
                        message: "Invalid email, username, or password format.",
                      },
                    });
                  }
                } else {
                  reject({
                    status: 400,
                    error: { message: "Missing email, username or password." },
                  });
                }
              }
            });
          }
        });
      })
        .then((data) => {
          res.status(201).json(data);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    loginUser: (req, res) => {
      // NOT SURE ABOUT THIS STRUCTURE;
      // A LOT OF REPEATED CODE

      // SYNC NOTES:
      // if user is not in database
      // bonus na lang
      // can make into helper function
      // validate login user helper (pass in data)
      // pwede ireturn yung actual status tapos gamitin sa promise chain

      new Promise((resolve, reject) => {
        const { loginInfo, password } = req.body;
        let user;
        if (isValidEmail(loginInfo)) {
          // login info entered is email
          usersRepository.loginUser("", loginInfo).then((data) => {
            if (data[0][0].length == 0) {
              reject({
                status: 404,
                error: { message: "User not found." },
              });
            }
            user = data[0][0][0];
            bcrypt.compare(password, user.password, (err, res) => {
              if (res) {
                delete user.password;
                const token = jwt.sign({ data: user }, "secret");
                resolve({ data: user, token: token });
              } else {
                reject({
                  status: 401,
                  error: { message: "Email and password do not match." },
                });
              }
            });
          });
        } else {
          // login info entered is username
          usersRepository.loginUser(loginInfo, "").then((data) => {
            if (data[0][0].length == 0) {
              reject({
                status: 404,
                error: { message: "User not found." },
              });
            }
            user = data[0][0][0];
            console.log(user);
            bcrypt.compare(password, user.password, (err, res) => {
              if (res) {
                delete user.password;
                const token = jwt.sign({ data: user }, "secret");
                resolve({ data: user, token: token });
              } else {
                reject({
                  status: 401,
                  error: { message: "Email and password do not match." },
                });
              }
            });
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

    getUser: (req, res) => {
      new Promise((resolve, reject) => {
        const id = req.params.userId;
        if (id) {
          usersRepository
            .checkIfIDExists(id)
            .then((data) => {
              if (data[0][0][0]["COUNT(id)"] > 0) {
                usersRepository
                  .getUserInformation(id)
                  .then((user) => {
                    resolve(user[0][0][0]);
                  })
                  .catch(() => {
                    reject({
                      status: 404,
                      error: { message: "User information not found." },
                    });
                  });
              } else {
                reject({
                  status: 404,
                  error: { message: "User not found." },
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
            error: { message: "ID parameter not found." },
          });
        }
      })
        .then((user) => {
          res.status(200).json(user);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    patchUser: (req, res) => {
      new Promise((resolve, reject) => {
        // ALL COMMENTS ARE ARE NOTES FROM SYNC
        // use promise all
        // ipromise lahat ng repo updates, if may nag-error, masasalo lahat

        // ichain na lang yung promises?

        // place all validation in promises.all
        // if after matapos lahat ng validations, pwede na i-update
        // promise all muna lahat ng validations; if walang rejection, pwede na gawin yung mga updates

        const { email, username, password, profilePicture } = req.body; // depende sa existing fields yung ipapass sa promise.all
        const id = req.params.userId;
        usersRepository.checkIfIDExists(id).then((data) => {
          if (data[0][0][0]["COUNT(id)"] > 0) {
            // there is a user that exists with the id
            // unahin mga validations; first promise all, puro validations
            let emailValidation;
            if (email) {
              emailValidation = new Promise((resolve, reject) => {
                if (isValidEmail(email)) {
                  usersRepository.checkIfEmailExists(email).then((data) => {
                    if (data[0][0][0]["COUNT(email)"] > 0) {
                      reject({
                        status: 409,
                        error: { message: "Email is already in use." },
                      });
                    } else {
                      resolve(true);
                    }
                  });
                } else {
                  reject({
                    status: 403,
                    error: { message: "Email format is invalid." },
                  });
                }
              });
            }

            let usernameValidation;
            if (username) {
              usernameValidation = new Promise((resolve, reject) => {
                if (isValidUsername) {
                  usersRepository.checkIfUserExists(username).then((data) => {
                    if (data[0][0][0]["COUNT(username)"] > 0) {
                      reject({
                        status: 409,
                        error: { message: "Username is already in use." },
                      });
                    } else {
                      resolve(true);
                    }
                  });
                } else {
                  reject({
                    status: 403,
                    error: { message: "Username format is invalid." },
                  });
                }
              });
            }

            let profilePictureValidation;
            if (profilePicture) {
              profilePictureValidation = new Promise((resolve, reject) => {
                resolve(true);
              });
            }

            let passwordValidation;
            if (password) {
              passwordValidation = new Promise((resolve, reject) => {
                resolve(true);
              });
            }

            Promise.all([
              emailValidation,
              usernameValidation,
              profilePictureValidation,
              passwordValidation,
            ])
              .then((validations) => {
                // validations[0] => emailPromise
                // validations[1] => usernamePromise
                // validations[2] => profilePicturePromise
                // validations[3] => passwordPromise

                console.log(validations);

                let changeEmail;
                if (validations[0]) {
                  changeEmail = new Promise((resolve, reject) => {
                    usersRepository
                      .updateEmail(id, email)
                      .then(() => {
                        resolve("email");
                      })
                      .catch(() => {
                        reject({
                          status: 500,
                          error: {
                            message:
                              "An error occurred while updating the email.",
                          },
                        });
                      });
                  });
                }

                let changeUsername;
                if (validations[1]) {
                  changeUsername = new Promise((resolve, reject) => {
                    usersRepository
                      .updateUsername(id, username)
                      .then(() => {
                        resolve("username");
                      })
                      .catch(() => {
                        reject({
                          status: 500,
                          error: {
                            message:
                              "An error occurred while updating the username.",
                          },
                        });
                      });
                  });
                }

                let changeProfilePicture;
                if (validations[2]) {
                  console.log("change pp run?");
                  changeProfilePicture = new Promise((resolve, reject) => {
                    usersRepository
                      .updateProfilePicture(id, profilePicture)
                      .then(() => {
                        resolve("profile picture");
                      })
                      .catch(() => {
                        reject({
                          status: 500,
                          error: {
                            message:
                              "An error occurred while updating the profilePicture.",
                          },
                        });
                      });
                  });
                }

                let changePassword;
                if (validations[3]) {
                  console.log("change pass run?");
                  changePassword = new Promise((resolve, reject) => {
                    bcrypt.genSalt(saltRounds, (err, salt) => {
                      bcrypt.hash(password, salt, (err, hash) => {
                        usersRepository
                          .updatePassword(id, hash)
                          .then(() => {
                            resolve("password");
                          })
                          .catch(() => {
                            reject({
                              status: 500,
                              error: {
                                message:
                                  "An error occurred while updating the password.",
                              },
                            });
                          });
                      });
                    });
                  });
                }

                Promise.all([
                  changeEmail,
                  changeUsername,
                  changeProfilePicture,
                  changePassword,
                ]).then((updates) => {
                  if (
                    updates[0] === undefined &&
                    updates[1] === undefined &&
                    updates[2] === undefined &&
                    updates[3] === undefined
                  ) {
                    reject({
                      status: 400,
                      error: { message: "No updates were made." },
                    });
                  } else {
                    resolve(updates);
                  }
                });
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            reject({
              status: 404,
              error: {
                message: "User not found.",
              },
            });
          }
        });
      })
        .then((updated) => {
          let updatedFields = "";
          for (let i = 0; i < updated.length; i++) {
            updated[i] !== undefined
              ? (updatedFields += updated[i] + ", ")
              : null;
          }

          // remove last two characters in string
          updatedFields = updatedFields.slice(0, -2);

          res.status(200).json({
            message: `Successfully updated the user's ${updatedFields}.`,
          });
        })
        .catch((error) => {
          res.status(error.status).json({ error: error.error });
        });
    },

    deleteUser: (req, res) => {
      new Promise((resolve, reject) => {
        const id = req.params.userId;
        usersRepository.checkIfIDExists(id).then((data) => {
          if (data[0][0][0]["COUNT(id)"] > 0) {
            usersRepository
              .deleteUser(id)
              .then(resolve())
              .catch(() => {
                reject({
                  status: 500,
                  error: {
                    message: "An error occurred while deleting the user.",
                  },
                });
              });
          } else {
            reject({
              status: 404,
              error: {
                message: "User not found.",
              },
            });
          }
        });
      })
        .then((user) => {
          res.status(200).json({
            status: "Successfully deleted user.",
            data: user,
          });
        })
        .catch((error) => {
          res.status(404).json(error.error);
        });
    },
  };
  return userController;
};
