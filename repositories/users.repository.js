module.exports = (knex) => {
  const usersRepository = {
    getAllUsers: () => {
      return knex.raw("CALL GetAllUsers()");
    },
    checkIfUsernameExists: (username) => {
      return knex.raw("CALL CheckIfUsernameExists(?)", [username]);
    },
    checkIfEmailExists: (email) => {
      return knex.raw("CALL CheckIfEmailExists(?)", [email]);
    },
    checkIfUserExists: (id) => {
      return knex.raw("CALL CheckIfIDExists(?)", [id]);
    },
    registerUser: (
      id,
      username,
      email,
      hashPassword,
      profilePicture,
      createdAt
    ) => {
      return knex.raw("CALL RegisterUser(?, ?, ?, ?, ?, ?)", [
        id,
        username,
        email,
        hashPassword,
        profilePicture,
        createdAt,
      ]);
    },
    loginUser: (email, username, password) => {
      return knex.raw("CALL LoginUser(?, ?)", [username, email]);
    },
    getUserInformation: (id) => {
      return knex.raw("CALL GetUserInformation(?)", [id]);
    },
    updateEmail: (id, email) => {
      return knex.raw("CALL UpdateEmail(?, ?)", [id, email]);
    },
    updateUsername: (id, username) => {
      return knex.raw("CALL UpdateUsername(?, ?)", [id, username]);
    },
    updatePassword: (id, password) => {
      return knex.raw("CALL UpdatePassword(?, ?)", [id, password]);
    },
    updateProfilePicture: (id, profilePicture) => {
      return knex.raw("CALL UpdateProfilePicture(?, ?)", [id, profilePicture]);
    },
    deleteUser: (id) => {
      return knex.raw("CALL DeleteUser(?)", [id]);
    },
  };
  return usersRepository;
};
