const Post = require("../models/post");
const createPost = (authorId, content, image) => {
  const newPost = new Post({ author: authorId, content, image });
  return newPost.save().then((newPost) => newPost._doc);
};

const getPost = () => {
  return Post.find()
    .populate("author")
    .populate({
      path: "comments",
      populate: "user ",
    })
    .exec()
    .then((posts) => posts.map((post) => post._doc));
};

const like = async (userId, postId) => {
  const post = await Post.findById(postId).exec();

  const hasLiked = post.likes.some((likedUserId) => {
    return likedUserId.equals(userId);
  });

  if (hasLiked) {
    post.likes.pull(userId);
  } else {
    post.likes.push(userId);
  }

  return (await post.save())
    .populate("author")
    .populate({
      path: "comments",
      populate: "user",
    })
    .execPopulate()
    .then((updatedPost) => updatedPost._doc);
};

const commnent = async (userId, postId, content) => {
  const post = await Post.findById(postId).exec();
  post.comments.push({
    user: userId,
    content: content,
  });
  return (await post.save())
    .populate("author")
    .populate({
      path: "comments",
      populate: "user",
    })
    .execPopulate()
    .then((updateedPost) => updateedPost._doc);
};

module.exports = { createPost, getPost, like, commnent };
