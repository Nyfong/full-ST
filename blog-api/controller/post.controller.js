const createError = require('http-errors');

const postModel = require('../models/post.model');

function list(req, res) {
  res.json({ posts: postModel.list() });
}

function getById(req, res, next) {
  const post = postModel.findById(req.params.id);
  if (!post) {
    return next(createError(404, 'Post not found'));
  }

  return res.json({ post: post });
}

function create(req, res) {
  const post = postModel.create({
    title: req.body.title,
    content: req.body.content,
    authorId: req.user.id
  });

  res.status(201).json({ post: post });
}

function update(req, res, next) {
  const post = postModel.findById(req.params.id);
  if (!post) {
    return next(createError(404, 'Post not found'));
  }

  if (post.authorId !== req.user.id) {
    return next(createError(403, 'Not allowed to modify this post'));
  }

  const updatedPost = postModel.update(post.id, {
    title: req.body.title,
    content: req.body.content
  });

  return res.json({ post: updatedPost });
}

function remove(req, res, next) {
  const post = postModel.findById(req.params.id);
  if (!post) {
    return next(createError(404, 'Post not found'));
  }

  if (post.authorId !== req.user.id) {
    return next(createError(403, 'Not allowed to delete this post'));
  }

  postModel.remove(post.id);
  return res.status(204).send();
}

// Admin: delete any post regardless of authorship
function adminRemove(req, res, next) {
  const post = postModel.findById(req.params.id);
  if (!post) {
    return next(createError(404, 'Post not found'));
  }
  postModel.remove(post.id);
  return res.status(204).send();
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  adminRemove
};

