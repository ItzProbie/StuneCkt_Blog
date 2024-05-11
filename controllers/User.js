const mongoose = require("mongoose");
const User = require("../models/User");

exports.follow = async(req,res) => {

    try{

        const {userId} = req.params;
        if(!userId){
            return res.status(400).json({
                success : false,
                message : "Missing userId"
            });
        }

        if(req.user.id === userId){
            return res.status(409).json({
                success : false,
                message : "Invalid Request"
            })
        }

        const user1 = await User.findById(userId);
        const user2 = await User.findById(req.user.id);
        if(!user1 || !user2){
            return res.status(404).json({
                success : false,
                message  : "Invalid User"
            });
        }

        if(user2.following.includes(new mongoose.Types.ObjectId(user1._id))){
            return res.status(409).json({
                success : false,
                message : "User already in followers"
            })
        }

        user1.follower.push(user2._id);
        user2.following.push(user1._id);

        await user1.save();
        await user2.save();

        return res.status(200).json({
            success : true,
            message : `Following ${user1.name}`
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message  : "Erro while following"
        });
    }

}

exports.unFollow = async(req,res) => {

    try{

        const {userId} = req.params;
        if(!userId){
            return res.status(400).json({
                success : false,
                message : "Missing userId"
            });
        }

        const user1 = await User.findById(userId);
        const user2 = await User.findById(req.user.id);
        if(!user1 || !user2){
            return res.status(404).json({
                success : false,
                message  : "Invalid User"
            });
        }

        if(!user2.following.includes(new mongoose.Types.ObjectId(user1._id))){
            return res.status(409).json({
                success : false,
                message : "Invalid Request"
            })
        }

        user2.following.pull(user1._id);
        user1.follower.pull(user2._id);

        await user1.save();
        await user2.save();

        return res.status(200).json({
            success : true,
            message : `unFollowed ${user1.name}`
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message  : "Erro while unFollowing"
        });
    }

}

exports.getAllFollowers = async(req,res) => {
    try{

        const user = await User.findById(req.user.id).select("follower").populate({
            path : "follower",
            model : "User",
            select : "name email image bio"
        }).exec();

        if(!user){
            return res.statsu(404).json({
                success : false,
                message : "User not found"
            });
        }

        return res.status(200).json({
            success : false,
            user
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message  : "Error while fetching followers"
        });
    }
}

exports.getAllFollowing = async(req,res) => {
    try{

        const user = await User.findById(req.user.id).select("following").populate({
            path : "following",
            model : "User",
            select : "name email image bio"
        }).exec();

        if(!user){
            return res.statsu(404).json({
                success : false,
                message : "User not found"
            });
        }

        return res.status(200).json({
            success : false,
            user
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message  : "Error while fetching following"
        });
    }
}