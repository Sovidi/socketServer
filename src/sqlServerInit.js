const queryExecute = require("./sqlConnection.js");

const sqlServerInit = (app) => {
  app.get("/lcm_select", async function (req, res) {
    console.log("select 요청");
    let getData = await queryExecute("select * from todotxt");
    res.send(getData);
  });

  app.post("/lcm_insert", async function (req, res) {
    const bodyData = req.body;
    await queryExecute("insert into todotxt (sKey, txt) values (?, ?)", [bodyData.key, bodyData.txt]);
    let getData = await queryExecute("select * from todotxt");

    res.send(getData);
  });

  app.delete(`/lcm_delete`, async function (req, res) {
    const { key } = req.query;
    await queryExecute("delete from todotxt where sKey=?", [key]);

    let getData = await queryExecute("select * from todotxt");
    res.send(getData);
  });

  app.put(`/lcm_update`, async function (req, res) {
    const bodyData = req.body;
    await queryExecute("update todotxt set txt=? where sKey=?", [bodyData.txt, bodyData.key]);

    let getData = await queryExecute("select * from todotxt");
    res.send(getData);
  });

  // 댓글삭제 http 연결 형식
  app.delete(`/lcm_chat_delete`, async function (req, res) {
    const { sKey } = req.query;
    await queryExecute("delete from chats where sKey=?", [sKey]);
    let getData = await queryExecute("select * from chats");

    res.send(getData);
  });
};

module.exports = sqlServerInit;
