const { verifyToken } = require("../services/auth");
const { User } = require("../models/user");

const authMiddleware = (required) => {
  return (req, res, next) => {
    if (!req.headers.authorization) {
      if (required) {
        res.status(401).send("Token not found");
      } else {
        next();
      }
    }
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decodedObj = verifyToken(token);
      const username = decodedObj.username;

      User.findOne({ username: username })
        .exec()
        .then((user) => {
          req.user = user._doc;
          next();
        })
        .catch(() => {
          res.status(404).send("User not found");
        });
    } catch {
      if (required) {
        res.status(401).send("Invalid token");
      } else {
        next();
      }
    }
  };
};
module.exports = { authMiddleware };
