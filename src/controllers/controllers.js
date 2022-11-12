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

    connection.query(
      "SELECT * FROM product, category WHERE product.category = category.id ORDER BY category.name",
      function (error, result) {
        if (error) throw error;
        //el callback function permite obtener el resultado
        connection.destroy();
        res.send(result);
      }
    );
  } catch (error) {
    res.status(500);
    res.send(error);
  }
};

const getProductsById = (req, res) => {
  try {
    const { id } = req.params;

    const connection = mysql.createConnection(db_config);

    connection.query(
      "SELECT product.id, product.name, product.url_image, product.price, product.category FROM product, category WHERE product.category = category.id AND category.id = ?",
      id,
      function (error, result) {
        if (error) throw error;
        connection.destroy();
        res.send(result);
      }
    );
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const searchProduct = (req, res) => {
  try {
    const { search } = req.params;
    const searchstr = "%" + search.toString() + "%";
    const connection = mysql.createConnection(db_config);

    connection.query(
      "SELECT * FROM product WHERE product.name LIKE ?",
      searchstr,
      function (error, result) {
        if (error) throw error;
        connection.destroy();
        res.send(result);
      }
    );
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

module.exports = {
  getAllProducts,
  getProductsById,
  searchProduct,
};
