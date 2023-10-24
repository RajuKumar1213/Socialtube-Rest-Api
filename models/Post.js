const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    userId: {
        type : String,
        required : true
    },
    desc : {
        type : String,
        max :500
    }, 
    img : {
        type : String, 
    },
    likes: {
        type : Array,
        default : []
    }
},
    { timestamps: true }
)

// exporting the model
module.exports = mongoose.model("Post", postSchema);