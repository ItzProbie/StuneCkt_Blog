// Comment Schema
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  //A comment can have multiple replies but an reply cant have more replies
  type: {
    type: String,
    enum : ["comment" , "reply"],
    required : true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  replies: {
    type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    default: [] 
  }
});

module.exports = mongoose.model("Comment", commentSchema);
