const { Server } = require("socket.io");
const queryExecute = require("./connection.js");

function webSocketStart() {
  // 바닐라 WS 코드작성 부분
  // const server = http.createServer(app);
  // const wss = new WebSocket.Server({ port: 3090 }, async () => {
  //   await console.log("ws 서버 연결됨");
  // });

  // const WebSocket = require("ws");
  // const wss = new WebSocket.Server({ port: 3090 }, async () => {
  //   await console.log("ws 서버 연결됨");
  // });

  // wss.on("connection", (socket) => {
  //   console.log("클라이언트가 접속하였습니다.");

  //   socket.on("message", (message) => {
  //     console.log("받은 메세지:", JSON.parse(message));
  //     socket.send("메세지 잘 받았습니다!");
  //   });

  //   socket.on("close", () => {
  //     console.log("클라이언트가 접속을 끊었습니다.");
  //   });
  // });

  // server.listen(3090, async () => {
  //   console.log("ws 서버 연결됨")
  // })

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

module.exports = webSocketStart;
