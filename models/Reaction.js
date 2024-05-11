const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema({

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    reactions: {
        type: [{
            post: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
                required: true
            },
            rxn: {
                type: String,
                enum: ["like", "dislike"],
                required: true
            }
        }],
        required : true,
        default: [] 
    }
}, { timestamps: true });

module.exports = mongoose.model("Reaction", reactionSchema);
