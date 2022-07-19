const express = require("express");
const router = express.Router();
const db = require("../utils/db.config.js");
const chatRepository = require("../repositories/chat.repository.js")(db);
const chatController = require("../controllers/chat.controller.js")(
  chatRepository
);

router.post("/", chatController.createRoom);
router.post("/createMessage", chatController.createMessage);
router.get("/rooms/:userId", chatController.getRoomsUserIsIn);
router.get("/messages/:roomId", chatController.getRoomMessages);

module.exports = router;
