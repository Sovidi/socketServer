const { Server } = require("socket.io");
const queryExecute = require("./sqlConnection.js");

function sqlWebSocketInit() {
  const io = new Server(3090, {
    cors: {
      origin: "*", // CORS 설정
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  let chat = [];
  io.on("connection", async (socket) => {
    console.log("socket.io connected");
    let getData = await queryExecute("select * from chats");
    chat = [...getData];
    socket.emit("chatData", JSON.stringify(chat));

    socket.on("submitMessage", async (message) => {
      console.log("message received");
      let chatData = await JSON.parse(message);
      chat = [...chat, chatData];

      await queryExecute("insert into chats (sKey, txt) values (?, ?)", [chatData.sKey, chatData.txt]);
      io.emit("submitMessage", JSON.stringify(chat));
    });

    // 댓글삭제 socket.io 형식
    socket.on("deleteChatKey", async (message) => {
      console.log("deleteChatKey received");
      const { sKey } = await JSON.parse(message);
      await queryExecute("delete from chats where sKey=?", [sKey]);
      let getData = await queryExecute("select * from chats");

      io.emit("chatData", JSON.stringify(getData));
    });

    socket.on("disconnect", async () => {
      console.log("socket.io disconnected");
      chat = [];
    });
  });
}

module.exports = sqlWebSocketInit;
