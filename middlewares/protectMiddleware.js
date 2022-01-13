const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModal");

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await UserModel.findById(decoded.id);
        console.log(req.user);
        next();
      } catch (err) {
        res.status(401);
        throw new Error("Unauthorized User");
      }
    }

    if (!token) {
      res.status(401);
      throw new Error("Unauthorized User No Token");
    }
  } catch (err) {
    next(err);
  }
};
// get token from request
// get user from the token
// set user to req object

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        throw new Error("You do not have permission to perform action");
      }
    } catch (err) {
      next(err);
    }

    next();
  };
};
