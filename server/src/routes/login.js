const express = require("express");
const { login, getAdmin} = require("../controllers/loginController");
const { loginMiddleware } = require("../middleware/loginMiddleware");

const router = express.Router();

router.post("/login", login );
router.get("/admin", loginMiddleware, getAdmin);


module.exports = router;
