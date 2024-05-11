const express = require("express");
const router = express.Router();

const {auth} = require("../middlewares/Auth");
const { follow, unFollow } = require("../controllers/User");

router.post("/follow/:userId" , auth , follow)
router.post("/unfollow/:userId" , auth , unFollow);

module.exports = router;