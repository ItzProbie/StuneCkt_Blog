const express = require("express");
const router = express.Router();

const {auth} = require("../middlewares/Auth");
const { follow, unFollow, getAllFollowers, getAllFollowing } = require("../controllers/User");

router.post("/follow/:userId" , auth , follow)
router.post("/unfollow/:userId" , auth , unFollow);
router.get("/followers/all" , auth , getAllFollowers);
router.get("/following/all" , auth , getAllFollowing);

module.exports = router;