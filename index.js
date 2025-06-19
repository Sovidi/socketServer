const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const httpPort = 3080;
const wsPort = 3090;

// websocket 연결부
// MongoDB 형식
const mongoWebSocketInit = require("./src/mongoWebSocketInit.js");
mongoWebSocketInit(wsPort);

// HTTP 연결부
// MongoDB 형식
const mongoDbInit = require("./src/mongoDbInit.js");
mongoDbInit(app);

// JSON Server 형식
// const jsonServerInit = require("./src/jsonServerInit.js");
// jsonServerInit(app);

// SQL MariaDB 형식
// const sqlServerInit = require("./src/sqlServerInit.js");
// sqlServerInit(app);

app.listen(httpPort, async () => {
  await console.log(httpPort, "node 서버 연결됨");
});
