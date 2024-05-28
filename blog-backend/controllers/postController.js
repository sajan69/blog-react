const Post = require('../models/Post');
const { validationResult } = require('express-validator');

// Create a post
exports.createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      user: req.user.id,
      category: req.body.category
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    let posts = req.query.category ? await Post.find({category:req.query.category}).sort({ date: -1 })
    .populate('user', 'name')
    .populate('category', 'name'): await Post.find().sort({ date: -1 })
    .populate('user', 'name')
    .populate('category', 'name');

    const search = req.query.search;
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      posts = posts.filter(post => searchRegex.test(post.title));
    }
    
    
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    .populate('user', 'name')
    .populate('category', 'name');

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const relatedPosts = await Post.find({
      category: post.category,
      _id: { $ne: post.id }
    })
    res.json({ post, relatedPosts });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  const { title, content } = req.body;

  const postFields = {};
  if (title) postFields.title = title;
  if (content) postFields.content = content;

  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: postFields },
      { new: true }
    );

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post.replaceOne=await Post.findByIdAndDelete(req.params.id);

    



    

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.likes.some(like => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json({ likesCount: post.likes.length, likes: post.likes });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (!post.likes.some(like => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    post.likes = post.likes.filter(
      ({ user }) => user.toString() !== req.user.id
    );

    await post.save();

    res.json({ likesCount: post.likes.length, likes: post.likes });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Comment on a post
exports.commentOnPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post = await Post.findById(req.params.id)
    .populate('user', 'name');

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newComment = {
      text: req.body.text,
      user: req.user.id,
      userName: req.user.name, // Add userName field with commenter's name
      date: Date.now()
    };
    console.log(req.user);
    post.comments.unshift(newComment);

    await post.save();

    res.json({ commentsCount: post.comments.length, comments: post.comments });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post.comments = post.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );

    await post.save();

    res.json({ commentsCount: post.comments.length, comments: post.comments });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};



// Get posts by category name
exports.getPostsByCategory = async (req, res) => {
  try {
    const posts = await Post.find({ category: req.params.category_id })
    .populate('user', 'name')
    .populate('category', 'name');
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};