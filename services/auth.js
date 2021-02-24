const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const SECRET_KEY = "MY_SECRET_KEY";

const generateToken = (username) => {
  return jwt.sign({ username }, SECRET_KEY, {
    expiresIn: 60000,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

const register = (username, password) => {
  const user = new User({
    username: username,
  });
  user.generatePassword(password);
  return user.save();
};

const login = (username, password) => {
  return User.findOne({ username: username })
    .exec()
    .then((user) => {
      if (!user.isPasswordMatched(password)) {
        throw new Error("Password not matched");
      }
      return {
        user: user._doc,
        jwt: generateToken(username),
      };
    });
};

const updateMe = (user, payload) => {
  return User.findOneAndUpdate({ _id: user._id }, { ...user, ...payload })
    .exec()
    .then((user) => user._doc);
};

module.exports = { register, login, verifyToken, updateMe };
