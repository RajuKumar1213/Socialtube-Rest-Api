const express = require ("express");
const app = express();

// requiring another module
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
// requiring routes 
const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");

// using dotenv 
dotenv.config()

// connection mongo db 

async function connectToMongo() {
    await mongoose.connect("mongodb://127.0.0.1:27017/socialtube");
    console.log("Connected to mongoDB database ");
} 
// calling the connectToMongo function with error handeling 
connectToMongo().catch(err => console.log(err));

// MIDDLE WARE 
app.use(express.json()) // it's is bodyparsor used when we make post request 
app.use(helmet()); //it help to protect express , node.js to security threats.
app.use(morgan("common")); //Morgan logs useful information about HTTP requests and responses, 

// middle ware for using routes 
app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);

app.listen(8000 , ()=> {
    console.log("Backend server is running on port 8000 !");
})