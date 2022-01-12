const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModal");

const protect = async (req, res, next) => {
  try{
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await UserModel.findById(decoded.id);
        next();
      } catch (err) {
        res.status(401);
        throw new Error("Unauthorized User");
      }
    }
  
    if(!token) {
      res.status(401);
      throw new Error("Unauthorized User No Token")
    }

  } catch(err){
    next(err)
  }
};

module.exports = protect;

// get token from request
// get user from the token
// set user to req object
