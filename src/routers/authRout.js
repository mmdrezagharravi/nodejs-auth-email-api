const express = require("express");
const router = express.Router();
const authControler = require("../controllers/authControler");

router.post("/singup", authControler.signup);

module.exports = router;
