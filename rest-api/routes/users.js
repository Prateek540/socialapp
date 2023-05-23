const User = require("../model/user");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

//get all users

router.get("/alluser", auth, async (req, res) => {
  try {
    const users = await User.find();
    const updatedUsers = [];
    users.map((user) => {
      const { _id, username, profilePicture } = user;
      updatedUsers.push({ _id, username, profilePicture });
    });
    res.status(200).json(updatedUsers);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get any user by userid

router.get("/getuser/:id", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    const { password, tokens, __v, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get any user by username
router.get("/:username", auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const { password, tokens, __v, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get user friends of userid

router.get("/friends/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const friends = await Promise.all(
      user.following.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (error) {
    res.status(500).send(error);
  }
});

//get user friends of username

router.get("/friends/username/:username", auth, async (req, res) => {
  try {
    console.log(req.params.username);
    const user = await User.findOne({ username: req.params.username });
    const friends = await Promise.all(
      user.following.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (error) {
    res.status(500).send(error);
  }
});

//update me
router.put("/", auth, async (req, res) => {
  if (req.body.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  try {
    const user = await User.findByIdAndUpdate(req.user.id, {
      $set: req.body,
    });
    res.status(200).json("Account updated");
  } catch (error) {
    res.status(500).json(error);
  }
});

//delete me

router.delete("/", auth, async (req, res) => {
  try {
    const user = await User.deleteOne({ _id: req.user.id });
    res.status(200).json("Account Deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

//follow a user

router.put("/:id/follow", auth, async (req, res) => {
  if (req.user.id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);
      if (!user.followers.includes(req.user.id)) {
        await user.updateOne({ $push: { followers: req.user.id } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json("User has been followed.");
      } else {
        res.status(403).json("You already follow.");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You cannot follow yourself");
  }
});

//unfollow a user

router.put("/:id/unfollow", auth, async (req, res) => {
  if (req.user.id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);
      if (user.followers.includes(req.user.id)) {
        await user.updateOne({ $pull: { followers: req.user.id } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("User has been unfollowed.");
      } else {
        res.status(403).json("You already not follow this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You cannot unfollow yourself");
  }
});

module.exports = router;
