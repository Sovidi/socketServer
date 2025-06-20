require("dotenv").config();
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  port: process.env.SQL_PORT,
});

connection.connect((err) => {
  if (err) {
    console.error("MySQL 연결 실패:", err);
  } else {
    console.log("MySQL 연결 성공");
  }
});

async function queryExecute(str, value) {
  let data = await new Promise((resolve, reject) => {
    connection.query(str, value, function (error, results) {
      resolve(results);
    });
  });
  return data;
}

module.exports = queryExecute;
