const express = require("express");
const router = express.Router();

const { createPost, createComment, getAllPosts, commentOnComment, like , dislike } = require("../controllers/Post");
const { auth } = require("../middlewares/Auth");

router.post("/create" , auth , createPost);
router.post("/:postId/comment" , auth , createComment);
router.post("/:postId/comment/:parentCommentId/reply" , auth , commentOnComment);
router.get("/all" , getAllPosts);
router.post("/:postId/like" , auth , like);
router.post("/:postId/dislike" , auth , dislike);

module.exports = router;