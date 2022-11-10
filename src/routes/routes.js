const { Router } = require("express");
const { getAllProducts, searchProduct } = require("../controllers/controllers");

const router = Router();

router.get("/", getAllProducts);

router.get("/search/:id", searchProduct);

module.exports = router;
