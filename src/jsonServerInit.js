const data = require("./jsonServerDataModule.js");

const jsonServerInit = (app) => {
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
};

module.exports = jsonServerInit;
