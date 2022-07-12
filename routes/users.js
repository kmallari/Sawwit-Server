var express = require("express");
var router = express.Router();

const { userUpload } = require("../controllers/storage");
const db = require("../repositories/db.config.js"); // change variable name to db
const usersRepository = require("../repositories/users.repository.js")(db);

const userController = require("../controllers/user.controller.js")(
  usersRepository
);

router.get("/", userController.getAllUsers);
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/:userId", userController.getUser);
router.patch(
  "/:userId",
  userUpload.single("profilePicture"),
  userController.updateUser
);
router.delete("/:userId", userController.deleteUser);

module.exports = router;
