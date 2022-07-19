module.exports = (db) => {
  const messagesRepository = {
    createRoom: (id, name, roomImage, createdAt) => {
      return db.raw("CALL CreateRoom(?, ?, ?, ?)", [
        id,
        name,
        roomImage,
        createdAt,
      ]);
    },
    createMessage: (
      id,
      senderId,
      senderUsername,
      senderProfilePicture,
      roomId,
      message,
      createdAt
    ) => {
      return db.raw("CALL CreateMessage(?, ?, ?, ?, ?, ?, ?)", [
        id,
        senderId,
        senderUsername,
        senderProfilePicture,
        roomId,
        message,
        createdAt,
      ]);
    },
    checkIfUserIsInRoom: (userId, roomId) => {
      return db.raw("CALL CheckIfUserIsInRoom(?, ?)", [userId, roomId]);
    },
    getRoomMessages: (roomId, start, items) => {
      return db.raw("CALL GetRoomMessages(?, ?, ?)", [roomId, start, items]);
    },
    addToRoom: (roomId, userId, createdAt) => {
      return db.raw("CALL AddToRoom(?, ?, ?)", [roomId, userId, createdAt]);
    },
    getRoomParticipants: (roomId) => {
      return db.raw("CALL GetRoomParticipants(?)", [roomId]);
    },
    getRoomsUserIsIn: (userId, start, end) => {
      return db.raw("CALL GetRoomsUserIsIn(?, ?, ?)", [userId, start, end]);
    },
  };
  return messagesRepository;
};
