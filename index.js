const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const WebSocket = require("ws");
const http = require("http");
const app = express();

const webSocketStart = require("./src/webSocket.js");
webSocketStart();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const queryExecute = require("./src/connection.js");
const data = require("./src/dataModule.js");

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

app.listen(3080, async () => {
  await console.log("서버 연결됨");
});
