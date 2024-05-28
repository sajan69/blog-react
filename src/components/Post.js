import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import '../Post.css';

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data.post);
      setRelatedPosts(res.data.relatedPosts);
    };

    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await api.post(
        `/posts/comment/${id}`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment('');
      const res = await api.get(`/posts/${id}`);
      setPost(res.data.post);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    try {
      await api.put(
        `/posts/like/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await api.get(`/posts/${id}`);
      setPost(res.data.post);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnLike = async () => {
    const token = localStorage.getItem('token');
    try {
      await api.put(
        `/posts/unlike/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await api.get(`/posts/${id}`);
      setPost(res.data.post);
    } catch (err) {
      console.error(err);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-container">
      <div className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <p className="post-category">Category: {post.category?.name}</p>
        <p className="post-date">Published on: {new Date(post.date).toLocaleString()}</p>
      </div>
      <div className="post-content">
        <p>{post.content}</p>
      </div>
      <div className="post-actions">
        <button className="post-action-btn" onClick={handleLike}>Like</button>
        <button className="post-action-btn" onClick={handleUnLike}>Unlike</button>
        <p className="post-likes">Likes: {post.likes?.length}</p>
      </div>
      <div className="post-author">
        <h3>Author: {post.user?.name}</h3>
      </div>
      <div className="post-comments">
        <h3>Comments: {post.comments?.length}</h3>
        <ul>
          {post.comments.map(comment => (
            <li key={comment._id} className="comment-item">
              <p className="comment-text">{comment.text}</p>
              <p className="comment-user">Comment by: {comment.username}</p>
            </li>
          ))}
        </ul>
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
            required
            className="comment-input"
          />
          <button type="submit" className="comment-btn">Comment</button>
        </form>
      </div>
      <div className="related-posts">
        <h3>Related Posts</h3>
        <ul>
          {relatedPosts.map(post => (
            <li key={post._id} className="related-post">
              <Link to={`/posts/${post._id}`} className="related-post-link">{post.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Post;
