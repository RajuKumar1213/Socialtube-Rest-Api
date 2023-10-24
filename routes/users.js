const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// UPDATE USER 
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        //if user want to update password , make a new hash
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                return res.status(500).json(error);
            }
        }
        //update the actual user 
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json("Account has been updated successfully !");
        } catch (error) {
            return res.status(500).json(error);
        }
    } else {
        return res.status(403).json("You can update only your account !");
    }
})

// DELETE USER 
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted successfully !");
        } catch (error) {
            return res.status(500).json(error);
        }
    } else {
        return res.status(403).json("You can delete only your account !");
    }
})

// GET A USER 
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, ...other } = user._doc; //hide password and updatedAt form the user object 
        res.status(200).json(other);
    } catch (error) {
        res.status(500).json("User not found !");
    }
})

// FOLLOW USER 
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            // find the user to follow
            const user = await User.findById(req.params.id);
            //current user 
            const currentUser = await User.findById(req.body.userId);

            //try to follow currentUser with user
            if (!user.followers.includes(req.body.userId)) {
                // updating both followers and followings of user and currentUser
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                // sending the response 
                res.status(200).json("User has been followed !");
            } else {
                res.status(403).json("You already follow this user !");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("You cant follow yourself !");
    }
})

// UNFOLLOW USER 
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            // find the user to follow
            const user = await User.findById(req.params.id);
            //current user 
            const currentUser = await User.findById(req.body.userId);

            //try to follow currentUser with user
            if (user.followers.includes(req.body.userId)) {
                // updating both followers and followings of user and currentUser
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                // sending the response 
                res.status(200).json("User has been unfollowed !");
            } else {
                res.status(403).json("You don't follow this user !");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("You cant unfollow yourself !");
    }
})


module.exports = router;
