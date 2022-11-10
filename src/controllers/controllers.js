const connection = require("../db");

const getAllProducts = (req, res) => {
  try {
    connection.query("SELECT * FROM product", function (error, result) {
      if (error) throw error;
      //console.log(result);
      //el callback function permite obtener el resultado
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
};

const searchProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(
      "SELECT * FROM product WHERE id = ?",
      id
    );
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

module.exports = {
  getAllProducts,
  searchProduct,
};
