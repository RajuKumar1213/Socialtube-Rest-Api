const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
//CREATE A POST 
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
})
//UPDATE A POST
router.put("/:id", async (req, res) => {
    try {
        // find the user 
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("Your post has been updated !");
        } else {
            res.status(403).json("You can update only your account !");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})
//DELETE A POST
router.delete("/:id", async (req, res) => {
    try {
        // find the user 
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("Your post has been deleted !");
        } else {
            res.status(403).json("You can deleted only your account !");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})
//LIKE / DISLIKE A POST
router.put("/:id/like", async (req, res) => {
    try {
        // find the post 
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            // pushing the id of user who liked the post 
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).send("Post has been liked !");
        } else {
            // pulling the id of user who already like the post 
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).send("Post has been disliked !");

        }
    } catch (error) {
        res.status(500).json(error);
    }
})
//GET A POST
router.get("/:id", async (req, res) => {
    try {
        // finding the perticular post 
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
})
//GET TIMELINE POSTS
router.get("/timeline/all", async (req, res) => {
    try {
        // finding current user 
        const currentUser = await User.findById(req.body.userId);
        // find current user posts 
        const userPost = await Post.find({ userId: currentUser._id });
        //finding current user friend's post 
        const friendPost = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        //concate current user post and friends post
        res.status(200).json(userPost.concat(...friendPost));
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;