const nanoid = require("nanoid");
module.exports = (io, chatRepository) => {
  io.sockets.on("connection", (socket) => {
    console.log("A user connected!");

    socket.on("joinRoom", async (userId, roomId) => {
      console.log(`Attempting to join room ${roomId}`);
      const sockitID = socket.id;
      console.log(sockitID);

      try {
        const data = await chatRepository.checkIfUserIsInRoom(userId, roomId);
        if (data[0][0].length >= 1) {
          socket.join(roomId);
          console.log("Room joined successfully.");
        } else {
          console.log("User is not in the room.");
        }
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("sendMessage", async (user, roomId, message) => {
      console.log(
        "🚀 ~ file: socket.js ~ line 39 ~ socket.on ~ roomId",
        roomId
      );
      console.log(
        "🚀 ~ file: socket.js ~ line 39 ~ socket.on ~ message",
        message
      );

      // await adding messages to db
      const chatId = nanoid.nanoid();
      const createdAt = Date.now();
      try {
        const data = await chatRepository.createMessage(
          chatId,
          user.id,
          user.username,
          user.profilePicture,
          roomId,
          message,
          createdAt
        );
        console.log("🚀 ~ file: socket.js ~ line 47 ~ socket.on ~ data", data[0][0][0])
        io.sockets.to(roomId).emit("receiveMessage", data[0][0][0]);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected!");
    });
  });
};
