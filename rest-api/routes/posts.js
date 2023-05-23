const router = require("express").Router();
const Post = require("../model/post");
const User = require("../model/user");
const auth = require("../middleware/auth");

//create

router.post("/", auth, async (req, res) => {
  const newPost = new Post({ ...req.body, userId: req.user.id });
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get timeline posts users
router.get("/timeline", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const userPost = await Post.find({ userId: currentUser.id });
    const friendPost = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPost.concat(...friendPost));
  } catch (error) {
    res.status(500).json(error);
  }
});

//get users all posts

router.get("/profile/:username", auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user.id });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});

//update your post

router.put("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId.toString() === req.user.id) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post has been updated");
    } else {
      res.status(403).json("You can update only your post.");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//delete your post

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId.toString() === req.user.id) {
      await post.deleteOne();
      res.status(200).json("Post has been deleted");
    } else {
      res.status(403).json("You can delete only your post.");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//like or dislike your post

router.put("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user.id)) {
      await post.updateOne({ $push: { likes: req.user.id } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.user.id } });
      res.status(200).json("The post has been disliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//get like status

router.get("/:id/likestatus", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user.id)) {
      res.status(200).json(false);
    } else {
      res.status(200).json(true);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
