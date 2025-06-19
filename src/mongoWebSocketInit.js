const { Server } = require("socket.io");
const dbConnect = require("./mongoConnection.js");

async function mongoWebSocketInit(wsPort) {
  const io = new Server(wsPort, {
    cors: {
      origin: "*", // CORS 설정
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  const { client, collection } = await dbConnect("chats");

  let chat = [];
  io.on("connection", async (socket) => {
    console.log("socket.io connected");

    let getData = await collection.find().toArray();
    chat = [...getData];

    socket.emit("chatData", JSON.stringify(chat));

    socket.on("submitMessage", async (message) => {
      console.log("message received");
      let chatData = await JSON.parse(message);
      chat = [...chat, chatData];
      await collection.insertOne(chatData);

      io.emit("submitMessage", JSON.stringify(chat));
    });

    // 댓글삭제 socket.io 형식
    socket.on("deleteChatKey", async (message) => {
      console.log("deleteChatKey received");
      const { key } = await JSON.parse(message);
      await collection.deleteOne({ key: key });
      let getData = await collection.find().toArray();

      io.emit("chatData", JSON.stringify(getData));
    });

    socket.on("disconnect", async () => {
      console.log("socket.io disconnected");
      chat = [];
    });
  });
}

module.exports = mongoWebSocketInit;
