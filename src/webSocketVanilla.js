const WebSocket = require("ws");
const http = require("http");

const server = http.createServer(app);
const wss = new WebSocket.Server({ port: 3090 }, async () => {
  await console.log("ws 서버 연결됨");
});

wss.on("connection", (socket) => {
  console.log("클라이언트가 접속하였습니다.");

  socket.on("message", (message) => {
    console.log("받은 메세지:", JSON.parse(message));
    socket.send("메세지 잘 받았습니다!");
  });

  socket.on("close", () => {
    console.log("클라이언트가 접속을 끊었습니다.");
  });
});

server.listen(3090, async () => {
  console.log("ws 서버 연결됨");
});
