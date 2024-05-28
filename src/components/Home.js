import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, FormControl, Button } from 'react-bootstrap';
import api from '../services/api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await api.get('/posts');
      setPosts(res.data);
    };

    const fetchCategories = async () => {
      const res = await api.get('/categories');
      setCategories(res.data);
    };

    fetchPosts();
    fetchCategories();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await api.get(`/posts?search=${searchTerm}`);
    setPosts(res.data);
  };

  const handleCategoryWisePosts = async (categoryId) => {
    const res = await api.get(`/posts?category=${categoryId}`);
    setPosts(res.data);
  };

  return (
    <Container>
      <h1 className="my-4">Blog Posts</h1>
      <Row className="mb-4">
      <Col md={6}>
            <Form inline='true' onSubmit={handleSearch} className="blog-search-form">
              <FormControl
                type="text"
                placeholder="Search Posts"
                className="mr-sm-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" variant="outline-primary" className="mt-2 ml-sm-2">Search</Button>
            </Form>
          </Col>
          <Col md={6}>
            <Form.Control as="select" className="mr-sm-2" onChange={(e) => handleCategoryWisePosts(e.target.value)}>
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </Form.Control>
          </Col>
        </Row>
      <Row>
        {posts.map(post => (
          <Col key={post._id} md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>
                  <Link to={`/posts/${post._id}`}>{post.title}</Link>
                </Card.Title>
                <Card.Text>By: {post.user?.name}</Card.Text>
                <Card.Text>{post.content.substring(0, 100)}...</Card.Text>
                <Card.Text className="mt-2">Category: {post.category?.name}</Card.Text>
                <Card.Text>Published on: {new Date(post.date).toLocaleString()}</Card.Text>
                <Card.Text>Likes: {post.likes?.length}<span role="img" aria-label="heart"> ❤️</span></Card.Text>
                <Card.Text>Comments: {post.comments?.length}<span role="img" aria-label="comment"> 💬</span></Card.Text>
                <Link to={`/posts/${post._id}`}>Read more</Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;
