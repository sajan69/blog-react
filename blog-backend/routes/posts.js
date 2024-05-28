const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  commentOnPost,
  deleteComment,
  getPostsByCategory,
} = require('../controllers/postController');
const { postValidation, commentValidation } = require('../validation/post');
const auth = require('../middleware/Auth');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', [auth, postValidation], createPost);

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get('/', getPosts);

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', getPostById);

// @route   PUT api/posts/:id
// @desc    Update post by ID
// @access  Private
router.put('/:id', auth, updatePost);

// @route   DELETE api/posts/:id
// @desc    Delete post by ID
// @access  Private
router.delete('/:id', auth, deletePost);

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, likePost);

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', auth, unlikePost);

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post('/comment/:id', [auth, commentValidation], commentOnPost);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment
// @access  Private
router.delete('/comment/:id/:comment_id', auth, deleteComment);


// @route   GET api/posts/category/:category_id
// @desc    Get posts by category
// @access  Public
router.get('/category/:category_id', getPostsByCategory);

module.exports = router;
