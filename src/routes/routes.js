const { Router } = require("express");
const {
  getAllProducts,
  getProductsById,
  searchProduct,
} = require("../controllers/controllers");

const router = Router();

router.get("/", getAllProducts);

router.get("/products/:id", getProductsById);

router.get("/product-search/:search", searchProduct);

module.exports = router;
