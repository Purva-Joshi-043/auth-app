const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
//Imports routes
const authRoute = require("./routes/auth");
const postRoute = require('./routes/posts')

dotenv.config();

//connect to db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true })
const con = mongoose.connection;
con.on("open", () => {
  console.log("connected to db");
});

//Middlewares
app.use(express.json());

//Route Middleware
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(3000, () => {
  console.log("Server Up and running");
});
