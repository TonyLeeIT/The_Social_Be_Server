const mongoose = require("mongoose");

const CommentShema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  content: {
    type: String,
    required: true,
  },
});

const PostShema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
    },

    comments: [CommentShema],
    image: String,
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("post", PostShema);

module.exports = Post;
