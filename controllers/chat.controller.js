const nanoid = require("nanoid");

module.exports = (chatRepository) => {
  const chatController = {
    getChat: (req, res) => {
      console.log("Chat");
    },
    createRoom: async (req, res) => {
      const { users } = req.body;
      const roomId = nanoid.nanoid();
      const roomName = users.map((user) => user.username).join(", ");
      const createdAt = Date.now();

      try {
        await chatRepository.createRoom(
          roomId,
          roomName,
          "imagelinkhere",
          createdAt
        );

        for (const user of users) {
          await chatRepository.addToRoom(roomId, user.id, createdAt);
        }

        res.status(200).json({
          message: "Room created successfully.",
          id: roomId,
          users: users,
          createdAt: createdAt,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error });
      }
    },
  };
  return chatController;
};
