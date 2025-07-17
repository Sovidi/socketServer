require("dotenv").config();
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGOKEY, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // 서버 선택 시간 제한
  connectTimeoutMS: 20000, // 연결 시간 제한
});

// 서버 종료 시 연결 닫기
process.on("SIGINT", async () => {
  await client.close();
  console.log("MongoDB connect 닫기 완료");
  process.exit(0);
});

module.exports = { client };
