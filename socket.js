const nanoid = require("nanoid");
module.exports = (io, chatRepository) => {
  io.sockets.on("connection", (socket) => {
    console.log("A user connected!");

    // // pwede ilipat yung buo sa isang post api  call
    // socket.on("createRoom", async (users) => {
    //   const roomId = nanoid();
    //   const roomName = users.map((user) => user.username).join(", ");

    //   // pwedeng gawing post api call
    //   // once mareflect yung list of room, doon palang magjojoin
    //   await chatRepository.createRoom(
    //     roomId,
    //     roomName,
    //     users.length,
    //     "imagelinkhere",
    //     Date.now()
    //   );

    //   // for (let user of users)
    //   // it dapat gamitin ^

    //   users.forEach(async (user) => {
    //     await chatRepository.addUserToRoom(roomId, user.id, Date.now());
    //   });

    //   socket.join(roomId);
    // });

    socket.on("joinRoom", async (roomId) => {
      console.log("Joining room...");
      const sockitID = socket.id;
      console.log(sockitID);
      socket.join(roomId);
    });

    socket.on("sendMessage", async (roomId, message) => {
      console.log("🚀 ~ file: socket.js ~ line 39 ~ socket.on ~ roomId", roomId)
      console.log("🚀 ~ file: socket.js ~ line 39 ~ socket.on ~ message", message)
      io.sockets.to(roomId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected!");
    });
  });
};
