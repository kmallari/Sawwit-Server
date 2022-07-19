const nanoid = require("nanoid");

module.exports = (chatRepository) => {
  const chatController = {
    getChat: (req, res) => {
      console.log("Chat");
    },
    createRoom: async (req, res) => {
      const { users } = req.body;
      const roomId = nanoid.nanoid();
      let roomName = users.map((user) => user.username).join(", ");
      if (roomName.length > 32) roomName = roomName.substring(0, 29) + "...";
      const createdAt = Date.now();

      try {
        await chatRepository.createRoom(
          roomId,
          roomName,
          "https://i.imgur.com/L9Xt17O.png",
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
    createMessage: async (req, res) => {
      const { user, roomId, message } = req.body;
      const chatId = nanoid.nanoid();
      const createdAt = Date.now();
      try {
        await chatRepository.createMessage(
          chatId,
          user.id,
          user.username,
          user.profilePicture,
          roomId,
          message,
          createdAt
        );

        res.status(200).json({
          id: chatId,
          user: user,
          roomId: roomId,
          message: message,
          createdAt: createdAt,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error });
      }
    },
    getRoomsUserIsIn: async (req, res) => {
      const { userId } = req.params;
      const { start, limit } = req.query;
      try {
        const data = await chatRepository.getRoomsUserIsIn(
          userId,
          start,
          limit
        );
        res.status(200).json({ data: data[0][0] });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error });
      }
    },
    getRoomMessages: async (req, res) => {
      const { roomId } = req.params;
      const { start, limit } = req.query;
      try {
        const data = await chatRepository.getRoomMessages(roomId, start, limit);       
        res.status(200).json({ data: data[0][0] });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error });
      }
    },
  };
  return chatController;
};
