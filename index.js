const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const WebSocket = require("ws");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// const server = http.createServer(app);
// const wss = new WebSocket.Server({ port: 3090 }, async () => {
//   await console.log("ws 서버 연결됨");
// });

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT,
});

async function queryExecute(str, value) {
  let data = await new Promise((resolve, reject) => {
    connection.query(str, value, function (error, results) {
      resolve(results);
    });
  });
  return data;
}

const data = {
  select: () => {
    const getData = JSON.parse(fs.readFileSync(`./data.json`));
    return getData;
  },
  insert: (bodyData) => {
    const select = data.select();
    const newData = [...select, bodyData];
    fs.writeFileSync(`./data.json`, newData);
    return newData;
  },
  update: (bodyData) => {
    const select = data.select();
    const newData = select.map((item) => {
      if (item.key == bodyData.key) {
        item.txt = bodyData.txt;
      }
      return item;
    });
    fs.writeFileSync(`./data.json`, newData);
    return newData;
  },
  delete: (key) => {
    const select = data.select();
    const newData = select.filter((item) => {
      return item.key != key;
    });
    fs.writeFileSync(`./data.json`, newData);
    return newData;
  },
};

// const data = {
//   select: () => {
//     return JSON.parse(fs.readFileSync(`./data.json`))
//   },
//   insert: (bodyData) => {
//     const sData = data.select()
//     const newData = [...sData, bodyData]
//     fs.writeFileSync(`./data.json`, JSON.stringify(newData))
//     return newData
//   },
//   update: (bodyData) => {

//     return []
//   },
//   delete: () => {
//     return []
//   }
// }

app.get("/select", async function (req, res) {
  console.log("select 요청");
  let getData = await queryExecute("select * from todotxt");
  res.send(getData);
});

app.post("/insert", async function (req, res) {
  const bodyData = req.body;
  await queryExecute("insert into todotxt (sKey, txt) values (?, ?)", [bodyData.key, bodyData.txt]);
  let getData = await queryExecute("select * from todotxt");

  res.send(getData);
});

app.delete(`/delete`, async function (req, res) {
  const { key } = req.query;
  await queryExecute("delete from todotxt where sKey=?", [key]);

  let getData = await queryExecute("select * from todotxt");
  res.send(getData);
});

app.put(`/update`, async function (req, res) {
  const bodyData = req.body;
  await queryExecute("update todotxt set txt=? where sKey=?", [bodyData.txt, bodyData.key]);

  let getData = await queryExecute("select * from todotxt");
  res.send(getData);
});

// 댓글삭제 http 연결 형식
app.delete(`/chatDelete`, async function (req, res) {
  const { sKey } = req.query;
  await queryExecute("delete from chats where sKey=?", [sKey]);
  let getData = await queryExecute("select * from chats");

  res.send(getData);
});

// 바닐라 WS 코드작성 부분
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

app.listen(3080, async () => {
  await console.log("서버 연결됨");
});

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
