const userModel = require('../../models/user.model');
const postModel = require('../../models/post.model');

module.exports = function resetData() {
  postModel.reset();
  userModel.reset();
};

