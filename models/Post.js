const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image : {
        type : String
    },
    content: {
        type: String,
        required: true
    },
    title : {
        type : String,
        required : true
    },
    likeCount: {
        type : Number,
        default : 0
    },
    dislikeCount : {
        type : Number,
        default : 0
    },
    comments: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }],
        default: [] 
    }

}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
