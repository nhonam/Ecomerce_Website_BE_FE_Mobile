const express = require("express");
const router = express.Router();
const Validator = require("../authenticator/index");
const Controller = require("../Controller/status.controller");


router.post("/purchase/buy",Controller.buyProduct)
router.post("/purchase/get",Controller.getStatusByUser)
router.post("/purchase/seller",Controller.getStatusBySeller)
router.get("/purchase/get/:id",Controller.getStatusId)
router.post("/sell/confirm",Controller.confirmSellProduct)

module.exports=router;
