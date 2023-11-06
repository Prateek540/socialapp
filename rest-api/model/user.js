const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Post = require("./post");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      max: 50,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email Invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      min: 6,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password cannot contain password");
        }
      },
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    description: {
      type: String,
      max: 50,
      default: "",
    },
    city: {
      type: String,
      max: 50,
      default: "",
    },
    from: {
      type: String,
      max: 50,
      default: "",
    },
    relationship: {
      type: String,
      max: 20,
      default: "",
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "userId",
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "secretkey");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.isValidFile = function (file) {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  const maxFileSize = 1024 * 1024 * 5; // 1MB

  return allowedTypes.includes(file.mimetype) && file.size <= maxFileSize;
};

userSchema.pre("deleteOne", { document: true }, async function (next) {
  try {
    const posts = await Post.find({ userId: this._id });
    for (let post of posts) {
      await post.deleteOne();
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
