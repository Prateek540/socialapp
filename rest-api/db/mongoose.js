const mongoose = require("mongoose");
require("dotenv").config();

//DB connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
      w: "majority",
      j: true,
      wtimeout: 1000,
    },
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });
