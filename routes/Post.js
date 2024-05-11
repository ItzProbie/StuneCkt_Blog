const express = require("express");
const router = express.Router();

const { createPost, createComment, getAllPosts, commentOnComment, like , dislike, getAllUserPosts, getPostByPage } = require("../controllers/Post");
const { auth } = require("../middlewares/Auth");

router.post("/create" , auth , createPost);
router.post("/:postId/comment" , auth , createComment);
router.post("/:postId/comment/:parentCommentId/reply" , auth , commentOnComment);
router.post("/:postId/like" , auth , like);
router.post("/:postId/dislike" , auth , dislike);
router.get("/all" , getAllPosts);
router.get("/:emailId/allPosts" , auth , getAllUserPosts);
router.get("/page" , getPostByPage);

module.exports = router;