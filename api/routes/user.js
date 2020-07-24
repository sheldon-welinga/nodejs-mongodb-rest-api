const express = require("express");
const router = express.Router();
const checkAuth  = require("../middleware/check-auth");

//User Controllers
const UserControllers = require("../controllers/user.controller");

router.post("/signup", UserControllers.user_signup)  //user creation or signup
router.post("/login", UserControllers.user_login); //login
router.delete("/:userId", checkAuth ,UserControllers.user_delete);  //delete user

module.exports = router;