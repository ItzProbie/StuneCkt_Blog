const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Reaction = require("../models/Reaction");
const User = require("../models/User");
const router = require("../routes/Post");

exports.createPost = async(req,res) => {

    try{

        const {title , content } = req.body;

        if(!title || !content){
            return res.status(400).json({
                success : false,
                message : "Missing Mandatory Fields"
            });
        }

        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({
                success : false,
                message : "Invalid User"
            });
        }

        const post = await Post.create({
            user : user._id , title , content
        });

        user.post.push(post._id);
        await user.save();

        return res.status(200).json({
            success : true,
            post
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Error while creating post"
        });
    }
    
}

exports.getAllPosts = async(req,res) => {

    try{

        const posts = await Post.find().
        populate({
            path : "comments",
            model : "Comment",
            populate : [
                {
                    path : "replies",
                    model : "Comment"
                }
            ]
        }).
        populate({
            path : "user",
            select : "name email image"
        }).exec();

        return res.status(200).json({
            success : true,
            posts
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Error while fetching posts"
        });
    }

}

exports.createComment = async(req,res) => {
    
    try{
        
        const {content} = req.body;
        const {postId} = req.params;

        if(!content || !postId){
            return res.status(400).json({
                success : false,
                message : "Missing Mandatory Fields"
            });
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                success : false,
                message : "Invalid PostID"
            });
        }

        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({
                success : false,
                message : "Invalid User"
            });
        }

        const comment = await Comment.create({
            post : post._id , 
            user : user._id,
            type : "comment",
            content
        })

        post.comments.push(comment._id);
        await post.save();

        return res.status(200).json({
            sucess : false,
            comment
        });


    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Error while creating comment"
        });
    }

}

exports.commentOnComment = async(req,res) => {
    
    try{

        const {content} = req.body;
        const {postId , parentCommentId} = req.params;

        if(!content || !postId || !parentCommentId){
            return res.status(400).json({
                success : false,
                message : "Missing Mandatory Fields"
            });
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                success : false,
                message : "Invalid PostID"
            });
        }

        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({
                success : false,
                message : "Invalid User"
            });
        }

        const parentComment = await Comment.findById(parentCommentId);
        if(!parentComment || parentComment.type !== "comment"){
            return res.status(404).json({
                success : false,
                message : "Invalid Parent Comment"
            });
        }

        const comment = await Comment.create({
            post : post._id , 
            user : user._id,
            type : "reply" ,
            content
        })

        parentComment.replies.push(comment._id);
        await parentComment.save();

        return res.status(200).json({
            success : true,
            comment
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Error while creating comment"
        });
    }

}

exports.like = async (req, res) => {
    try {
        const { postId } = req.params;

        if (!postId) {
            return res.status(400).json({
                success: false,
                message: "Invalid Post ID"
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const user = await User.findById(req.user.id).populate('reaction'); 
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if the user previously reacted to the post
        const existingReactionIndex = user.reaction.reactions.findIndex(reaction => reaction.post.equals(post._id));
        if (existingReactionIndex !== -1) {
            if (user.reaction.reactions[existingReactionIndex].rxn === "dislike") {
                user.reaction.reactions[existingReactionIndex].rxn = "like";
                await user.reaction.save(); 
                post.likeCount++;
                post.dislikeCount--;
                await post.save(); 
            }
        } else {
            user.reaction.reactions.push({ post: post._id, rxn: 'like' });
            await user.reaction.save(); 
            post.likeCount++;
            await post.save(); 
        }

        return res.status(200).json({
            success: true,
            message: "Liked Successfully"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error while Liking"
        });
    }
}


exports.dislike = async (req, res) => {
    try {
        const { postId } = req.params;

        if (!postId) {
            return res.status(400).json({
                success: false,
                message: "Invalid Post ID"
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const user = await User.findById(req.user.id).populate('reaction'); 
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if the user previously reacted to the post
        const existingReactionIndex = user.reaction.reactions.findIndex(reaction => reaction.post.equals(post._id));
        if (existingReactionIndex !== -1) {
            if (user.reaction.reactions[existingReactionIndex].rxn === "like") {
                user.reaction.reactions[existingReactionIndex].rxn = "dislike";
                await user.reaction.save(); 
                post.likeCount--;
                post.dislikeCount++;
                await post.save();
            }
        } else {
            user.reaction.reactions.push({ post: post._id, rxn: 'dislike' });
            await user.reaction.save(); 
            post.dislikeCount++;
            await post.save(); 
        }

        return res.status(200).json({
            success: true,
            message: "Disliked Successfully"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error while Liking"
        });
    }
}

exports.getAllUserPosts = async(req,res) => {

    try{

        const {emailId} = req.params;
        if(!emailId){
            return res.status(400).json({
                success : false,
                message : "Missing EmailId"
            })
        }

        const posts = await User.findOne({email : emailId}).select("name bio post").populate("post").exec();
        if(!posts){
            return res.status(404).json({
                succes : false,
                message : "User Not Found"
            });
        }

        return res.status(200).json({
            success : true,
            posts
        });


    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Error while fetching User Requests"
        });
    }

}
