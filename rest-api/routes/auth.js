const router = require("express").Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const upload = require("../app");

//Register
router.post(
  "/register",
  upload.fields([{ name: "file1" }, { name: "file2" }]),
  async (req, res) => {
    const file1 = req.files["file1"][0];
    const file2 = req.files["file2"][0];

    if (!file1 || !file2) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!User.isValidFile(file1) && !User.isValidFile(file2)) {
      return res.status(400).json({ error: "Invalid file type or size." });
    }

    const { path: path1 } = file1;
    const { path: path2 } = file2;
    try {
      const salt = await bcrypt.genSalt(10);
      console.log(req.body.username);
      const newPassword = req.body.password.toString();
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        profilePicture: path1,
        coverPicture: path2,
        description: req.body.description,
        city: req.body.city,
        from: req.body.from,
        relationship: req.body.relationship,
      });
      const user = await newUser.save();
      const token = await user.generateAuthToken();
      const { password, tokens, __v, ...other } = user._doc;
      res.status(200).json({ other, token });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

//Login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(404).send("User not found");
    }
    const newPassword = req.body.password.toString();
    const validPassword = await bcrypt.compare(newPassword, user.password);
    if (!validPassword) {
      res.status(400).send("Wrong Password");
    }
    const token = await user.generateAuthToken();
    const { password, tokens, __v, ...other } = user._doc;
    res.status(200).send({ other, token });
  } catch (error) {
    res.status(500).json(error);
  }
});

//Logout

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send("Logged out");
  } catch (error) {
    res.status(500).json(error);
  }
});

//LogoutAll

router.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send("Logged out from all");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
