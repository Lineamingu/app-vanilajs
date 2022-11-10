const mysql = require("mysql");

const db_config = {
  host: "mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com",
  port: "3306",
  user: "bsale_test",
  password: "bsale_test",
  database: "bsale_test",
};

const connection = mysql.createConnection(db_config);

// .connect es implicito si se realiza un query
connection.connect(function (error) {
  if (error) throw error;
  return;
});

connection.on("error", function (err) {
  //console.log(err.code);
  if (err.code == "PROTOCOL_CONNECTION_LOST") {
    connection.connect(function (error) {
      console.log(error);
      return;
    });
  }
});

module.exports = connection;
