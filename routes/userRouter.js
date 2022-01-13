const express = require("express");
const {
  loginUser,
  registerUser,
  readAllUsers,
  deleteUser
} = require("../controllers/userController");
const {protect, restrictTo} = require("../middlewares/protectMiddleware");

const router = express.Router();

router.get("/", protect, readAllUsers);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.route('/:id').delete(protect, restrictTo('admin'), deleteUser)

module.exports = router;
