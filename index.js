const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Socket.io mongoDB 연결부
const mongoWebSocketInit = require("./src/mongoWebSocketInit.js");
mongoWebSocketInit();

// MongoDB 형식
const mongoDbInit = require("./src/mongoDbInit.js");
mongoDbInit(app);

// JSON Server 형식
// const jsonServerInit = require("./src/jsonServerInit.js");
// jsonServerInit(app);

// SQL MariaDB 형식
// const sqlServerInit = require("./src/sqlServerInit.js");
// sqlServerInit(app);

app.listen(3080, async () => {
  await console.log("node 서버 연결됨");
});
