const express = require("express");
const { scanLocalNetwork } = require("local-network-scan");
const router = express.Router();

const Validator = require("../authenticator/index");
const Controller = require("../Controller/admin.controller");
const authenticator = require("../authenticator/authenticator");
const jwtService = require("../services/jwt.service");

router.get("/getUser", jwtService.verify, Controller.getAuth);
router.post("/register", Controller.register);
router.post("/updateProfile", Controller.updateProfile);
router.patch("/updatePatchProfile", Controller.updatePatchProfile);


router.post("/login", Controller.login);
router.post("/verify/seller", Controller.sendMail);
router.post("/verify/seller/:id", Controller.verifyUser);
router.get("/sent-mail-noti", Controller.sendMailNotification);


module.exports = router;