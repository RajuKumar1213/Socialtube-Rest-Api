const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER THE NEW USER 
router.post("/register", async (req, res) => {
    try {
        // creating new hashed password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // created new user 
        const newUser = await User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })

        // save the user and resposd 
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
})

// LOGIN THE USER 
router.post("/login", async (req, res) => {
    try {
        // finding user in the database 
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json("User not found !");

        //comparing password with the hash 
        const validatePassword = await bcrypt.compare(req.body.password, user.password);
        !validatePassword && res.status(400).json("Wrong password");

        // if everything correct send the entire user
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json(error);
    }
})


module.exports = router;
