const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// const data = {
//   firstName: "rt",
//   lastName: "ty",
//   email: "yu@yj.com",
//   country: "United Kingdom",
//   phone: "0774749569",
//   job: "Front End Developer",
//   gender: "Male",
//   company: "234",
//   salary: "16lpa",
//   address: "9, coldcotes Avenue",
//   city: "leeds",
//   state: "Leeds",
//   pin: "LS96NA",
// };

// @route POST api/posts
// @desc Create a post
// @access Private
router.post(
  "/",
  [
    auth,
    [
      check("firstName", "First Name is required").not().isEmpty(),
      check("lastName", "Last Name is required").not().isEmpty(),
      check("email", "Please include a valid email").isEmail(),
      check("country", "country is required").not().isEmpty(),
      check("phone", "phone is required").not().isEmpty(),
      check("job", "job is required").not().isEmpty(),
      check("gender", "gender is required").not().isEmpty(),
      check("company", "company is required").not().isEmpty(),
      check("salary", "salary is required").not().isEmpty(),
      check("address", "address is required").not().isEmpty(),
      check("city", "city is required").not().isEmpty(),
      check("state", "state is required").not().isEmpty(),
      check("pin", "pin is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const {
        firstName,
        lastName,
        email,
        country,
        phone,
        job,
        gender,
        company,
        salary,
        address,
        city,
        state,
        pin,
      } = req.body;

      const newPost = new Post({
        name: user.name,
        firstName,
        lastName,
        email,
        country,
        phone,
        job,
        gender,
        company,
        salary,
        address,
        city,
        state,
        pin,
        // text: req.body.text,
        // avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.send(post);
    } catch (error) {
      //   console.log(error);
      res.status(500).send("Server error");
    }
  }
);

// @route GET api/posts
// @desc Get all posts
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// @route GET api/posts/:id
// @desc Get all posts
// @access Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route DELETE api/posts/:id
// @desc Delete post
// @access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.deleteOne();

    res.json({ msg: "Post removed" });
  } catch (error) {
    console.log(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route PUT api/posts/:id
// @desc update post record
// @access Private
router.put("/:id", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (post) {
      delete req.body._id;
      post = await Post.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { $set: req.body },
        { new: true }
      );
    }
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// @route PUT api/posts/:id
// @desc update post record
// @access Private
router.get("/search/:id/:key", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    console.log("post ID", post);
    if (post) {
      //   delete req.body._id;
      //   post = await Post.findOneAndUpdate(
      //     { _id: req.params.id, user: req.user.id },
      //     { $set: req.body },
      //     { new: true }
      //   );
      post = await Post.find({
        $or: [
          { firstName: { $regex: req.params.key } },
          { lastName: { $regex: req.params.key } },
          { email: { $regex: req.params.key } },
          { phone: { $regex: req.params.key } },
        ],
      });
      console.log(post);
    }
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// @route PUT api/posts/like/:id
// @desc likes a post
// @access Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();

    res.json(post.likes);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// @route PUT api/posts/unlike/:id
// @desc likes a post
// @access Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }
    // Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// @route POST api/posts/comment/:id
// @desc Comment on a post
// @access Private
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();
      res.send(post.comments);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

// @route DELETE api/posts/comment/:id/:comment_id
// @desc Delete comment
// @access Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    // make sure comment
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }
    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "User not authorized" });
    }

    // Get remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});
module.exports = router;
