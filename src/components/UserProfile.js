import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
        setPosts(response.data.posts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };



    fetchUserProfile();
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(posts.filter(post => post._id !== postId));
    }
    catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>{user.name}</Card.Title>
              <Card.Text>{user.email}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <h3>User's Posts</h3>
          <Row>
            {posts.map(post => (
              <Col key={post._id} md={6}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>
                      <Link to={`/posts/${post._id}`}>{post.title}</Link>
                    </Card.Title>
                    <Card.Text>{post.content.substring(0, 100)}...</Card.Text>
                    {/* dekete post button */}
                    <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                    
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
