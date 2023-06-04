const express = require("express");
const router = express.Router();
const Validator = require("../authenticator/index");
const Controller = require("../Controller/product.controller");
const authenticator = require("../authenticator/authenticator");
const jwtService = require("../services/jwt.service");


router.post("/create", Controller.createProduct);
router.post("/getbyseller", Controller.getProductBySeller);
router.post("/get-top-product", Controller.getTopProduct);

router.post("/update/:id", Controller.updateProduct)

router.get("/item/:id", Controller.getProduct)
router.get("/itemproduct/:id", Controller.getProductById)
router.delete('/delete/:id', Controller.deleteProduct)
router.get("/get/allProduct", Controller.getAllProduct)
router.post("/check-product/:id", Controller.checkProductExist)
router.get("/get-product-myear/:id", Controller.getProductMonthyear)
router.get("/get/allCategory", Controller.getAllCategory)
router.post("/get/type",Controller.getTypeProduct)
router.get("/search/item",Controller.searchProduct)
router.get("/get/allProduct/:id",Controller.getAllProductByCategory)
router.patch("/updatePatch/:id", Controller.patchProduct)

module.exports= router
