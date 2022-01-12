const express = require("express");
const {
  loginUser,
  registerUser,
  readAllUsers,
} = require("../controllers/userController");
const protect = require("../middlewares/protectMiddleware");

const router = express.Router();

router.get("/", protect, readAllUsers);
router.post("/login", loginUser);
router.post("/register", registerUser);

module.exports = router;
