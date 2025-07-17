// mongoConnection.js
let { client } = require("./mongoClient.js");

let connectSafer = true;

async function mongoDbConnect(collectionName) {
  if (connectSafer) {
    try {
      await client.connect();
      connectSafer = false;
      console.log("MongoDB connect 신규 연결함");
    } catch (err) {
      console.error("MongoDB connect 실패:", err.message);
      throw err;
    }
  } else {
    console.log("MongoDB connect 이미 연결됨(연결회피)");
  }

  const db = client.db("test");
  return { client, collection: db.collection(collectionName) };
}

module.exports = mongoDbConnect;
