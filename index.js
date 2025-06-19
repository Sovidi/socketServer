const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const dbConnect = require("./src/mongoConnection.js");

const mongoWebSocket = require("./src/mongoWebSocket.js");
// mongoWebSocket();

const data = require("./src/dataModule.js");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB 형식
// app.get("/lcm_select", async function (req, res) {
//   console.log("select 요청");
//   const { client, collection } = await dbConnect("threads");
//   let getData = await collection.find().toArray();

//   res.send(getData);
// });

// app.post("/lcm_insert", async function (req, res) {
//   const bodyData = req.body;
//   const { client, collection } = await dbConnect("threads");
//   await collection.insertOne(bodyData);
//   let getData = await collection.find().toArray();

//   res.send(getData);
// });

// app.delete(`/lcm_delete`, async function (req, res) {
//   const { key } = req.query;
//   const { client, collection } = await dbConnect("threads");
//   await collection.deleteOne({ key: key });
//   let getData = await collection.find().toArray();

//   res.send(getData);
// });

// app.put(`/lcm_update`, async function (req, res) {
//   const bodyData = req.body;
//   const { client, collection } = await dbConnect("threads");
//   await collection.updateOne({ key: bodyData.key }, { $set: { txt: bodyData.txt } });
//   let getData = await collection.find().toArray();

//   res.send(getData);
// });

// 댓글삭제 http 연결 형식
// app.delete(`/lcm_chat_delete`, async function (req, res) {
//   const { key } = req.query;
//   const { client, collection } = await dbConnect("threads");
//   await collection.deleteOne({ key: key });
//   let getData = await collection.find().toArray();

//   res.send(getData);
// });

// JSON Server 형식
app.get("/lcm_select", async function (req, res) {
  console.log("select 요청");
  let getData = data.select();
  res.send(getData);
});

app.post("/lcm_insert", async function (req, res) {
  const bodyData = req.body;
  let getData = data.insert(bodyData);
  res.send(getData);
});

app.delete(`/lcm_delete`, async function (req, res) {
  const { key } = req.query;
  console.log("key", key);
  let getData = data.delete(key);
  res.send(getData);
});

app.put(`/lcm_update`, async function (req, res) {
  const bodyData = req.body;
  let getData = data.update(bodyData);
  res.send(getData);
});

// 댓글삭제 http 연결 형식
app.delete(`/lcm_chat_delete`, async function (req, res) {
  const { key } = req.query;
  let getData = data.chatDelete(key);
  res.send(getData);
});

// SQL
// const queryExecute = require("./src/connection.js");

// app.get("/lcm_select", async function (req, res) {
//   console.log("select 요청");
//   let getData = await queryExecute("select * from todotxt");
//   res.send(getData);
// });

// app.post("/lcm_insert", async function (req, res) {
//   const bodyData = req.body;
//   await queryExecute("insert into todotxt (sKey, txt) values (?, ?)", [bodyData.key, bodyData.txt]);
//   let getData = await queryExecute("select * from todotxt");

//   res.send(getData);
// });

// app.delete(`/lcm_delete`, async function (req, res) {
//   const { key } = req.query;
//   await queryExecute("delete from todotxt where sKey=?", [key]);

//   let getData = await queryExecute("select * from todotxt");
//   res.send(getData);
// });

// app.put(`/lcm_update`, async function (req, res) {
//   const bodyData = req.body;
//   await queryExecute("update todotxt set txt=? where sKey=?", [bodyData.txt, bodyData.key]);

//   let getData = await queryExecute("select * from todotxt");
//   res.send(getData);
// });

// 댓글삭제 http 연결 형식
// app.delete(`/lcm_chat_delete`, async function (req, res) {
//   const { sKey } = req.query;
//   await queryExecute("delete from chats where sKey=?", [sKey]);
//   let getData = await queryExecute("select * from chats");

//   res.send(getData);
// });

app.listen(3080, async () => {
  await console.log("node 서버 연결됨");
});
