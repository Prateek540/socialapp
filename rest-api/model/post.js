const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      max: 500,
      trim: true,
      required: true,
    },
    image: {
      type: String,
      default: "",
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

postSchema.statics.isValidFile = function (file) {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  const maxFileSize = 1024 * 1024 * 5; // 1MB

  return allowedTypes.includes(file.mimetype) && file.size <= maxFileSize;
};

module.exports = mongoose.model("Post", postSchema);
