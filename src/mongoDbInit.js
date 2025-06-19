const dbConnect = require("./mongoConnection.js");

const mongoDbInit = (app) => {
  app.get("/lcm_select", async function (req, res) {
    console.log("select 요청");
    const { client, collection } = await dbConnect("threads");
    let getData = await collection.find().toArray();

    res.send(getData);
  });

  app.post("/lcm_insert", async function (req, res) {
    const bodyData = req.body;
    const { client, collection } = await dbConnect("threads");
    await collection.insertOne(bodyData);
    let getData = await collection.find().toArray();

    res.send(getData);
  });

  app.delete(`/lcm_delete`, async function (req, res) {
    const { key } = req.query;
    const { client, collection } = await dbConnect("threads");
    await collection.deleteOne({ key: key });
    let getData = await collection.find().toArray();

    res.send(getData);
  });

  app.put(`/lcm_update`, async function (req, res) {
    const bodyData = req.body;
    const { client, collection } = await dbConnect("threads");
    await collection.updateOne({ key: bodyData.key }, { $set: { txt: bodyData.txt } });
    let getData = await collection.find().toArray();

    res.send(getData);
  });

  // 댓글삭제 http 연결 형식
  app.delete(`/lcm_chat_delete`, async function (req, res) {
    const { key } = req.query;
    const { client, collection } = await dbConnect("threads");
    await collection.deleteOne({ key: key });
    let getData = await collection.find().toArray();

    res.send(getData);
  });
};

module.exports = mongoDbInit;
