const express = require("express");
const app = express();

//DB
require("./db/mongoose");

const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

//Middlewares

app.use(express.json());
app.use(express.static("public"));
app.use(cors());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

module.exports = app;
