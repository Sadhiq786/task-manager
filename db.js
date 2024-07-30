const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "project",
  database: "CRUD-Operations",
});

con.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: ", err.stack);
    return;
  }
  console.log("MySQL connected as id " + con.threadId);
});

module.exports = con;
