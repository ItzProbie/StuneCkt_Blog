const mongoose = require("mongoose");
const Reaction = require("./Reaction");
const Post = require("./Post");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    bio: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    follower: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        default: []
    },
    following: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        default: []
    },
    post: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }],
        default: []
    },
    reaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reaction",
        default : null
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
