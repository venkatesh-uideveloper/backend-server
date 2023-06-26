const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Post = require("../../models/Post");
// const Profile = require("../../models/Profile");
const User = require("../../models/User");

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
    // const posts = await Post.find().sort({ date: -1 });
    // res.json(posts);
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const result = {};
    const totalPosts = await Post.countDocuments().exec();
    let startIndex = pageNumber * limit;
    const endIndex = (pageNumber + 1) * limit;
    result.totalPosts = totalPosts;
    if (startIndex > 0) {
      result.previous = {
        pageNumber: pageNumber - 1,
        limit: limit,
      };
    }
    if (endIndex < (await Post.countDocuments().exec())) {
      result.next = {
        pageNumber: pageNumber + 1,
        limit: limit,
      };
    }
    result.records = await Post.find()
      .sort({ date: -1 })
      .skip(startIndex)
      .limit(limit)
      .exec();
    result.rowsPerPage = limit;
    return res.json({ msg: "Posts Fetched successfully", data: result });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// @route PUT api/posts/search/:key
// @desc Search key return result
// @access Private
router.get("/search/:key", auth, async (req, res) => {
  try {
    const post = await Post.find({
      $or: [
        { firstName: { $regex: new RegExp(req.params.key, "i") } },
        { lastName: { $regex: new RegExp(req.params.key, "i") } },
        { email: { $regex: new RegExp(req.params.key, "i") } },
        { phone: { $regex: new RegExp(req.params.key, "i") } },
      ],
    });
    res.json(post);
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

module.exports = router;
