const mysql = require("mysql");
const db_config = require("../db");

const getAllProducts = (req, res) => {
  try {
    const connection = mysql.createConnection(db_config);

    //.connect es implicito si se realiza un query
    // connection.connect(function (error) {
    //   if (error) throw error;
    //   return;
    // });

    connection.query("SELECT * FROM product", function (error, result) {
      if (error) throw error;
      //el callback function permite obtener el resultado
      //console.log(result);
      connection.destroy();
      res.send(result);
    });
  } catch (error) {
    //console.log(error);
    res.status(500);
    res.send(error);
  }
};

const searchProduct = (req, res) => {
  try {
    const { id } = req.params;

    const connection = mysql.createConnection(db_config);

    connection.query(
      "SELECT * FROM product WHERE id = ?",
      id,
      function (error, result) {
        if (error) throw error;
        //el callback function permite obtener el resultado
        //console.log(result);
        connection.destroy();
        res.send(result);
      }
    );
  } catch (error) {
    //console.log(error);
    res.status(500);
    res.send(error.message);
  }
};

module.exports = {
  getAllProducts,
  searchProduct,
};
