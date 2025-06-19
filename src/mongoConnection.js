// mongoConnection.js
require("dotenv").config();
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGOKEY);
let connectSafer = true;

async function dbConnect(collectionName) {
  if (connectSafer) {
    await client.connect();
    connectSafer = false;
    console.log("MongoDB connect 신규 연결함");
  } else {
    console.log("MongoDB connect 이미 연결됨(연결회피)");
  }

  const db = client.db("test");
  return { client, collection: db.collection(collectionName) };
}

// 서버 종료 시 연결 닫기
process.on("SIGINT", async () => {
  await client.close();
  console.log("❎ MongoDB connect 닫기 완료");
  process.exit(0);
});

module.exports = dbConnect;
