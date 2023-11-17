const auth = require("../middleware/auth");
const Comment = require("../model/Comment");

const router = require("express").Router();

//Create
router.post("/:postId/:userId", auth, async (req, res) => {
  try {
    const comment = new Comment({
      postId: req.params.postId,
      userId: req.params.userId,
      text: req.body.text,
    });
    await comment.save();
    res.status(200).json("Comment created");
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get Comments of a post by post id

router.get("/getComments/:postId", auth, async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
