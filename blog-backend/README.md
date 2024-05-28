## Software Requirements Specification (SRS) Document

### Project: Simple Blog Site By Sajan Adhikari

---

### 1. Introduction

#### 1.1 Purpose
The purpose of this document is to provide a detailed description of the requirements for the Simple Blog Site project. It will cover the system's functionality, design, and interfaces, serving as a guide for developers and stakeholders.

#### 1.2 Scope
The Simple Blog Site is a web application that allows users to register, log in, create posts, like posts, and comment on posts. The application will include features for user authentication, post creation, and engagement metrics such as like and comment counts.

#### 1.3 Definitions, Acronyms, and Abbreviations
- **JWT**: JSON Web Token
- **API**: Application Programming Interface
- **SRS**: Software Requirements Specification

#### 1.4 References
- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JSON Web Token Documentation](https://jwt.io/introduction/)

---

### 2. Overall Description

#### 2.1 Product Perspective
The Simple Blog Site is a standalone web application built using Node.js, Express.js, and MongoDB. It provides a RESTful API for client-side interactions.

#### 2.2 Product Functions
- User registration and authentication
- Post creation, retrieval, updating, and deletion
- Liking and unliking posts
- Commenting on posts and deleting comments
- Tracking and displaying the count of likes and comments for each post

#### 2.3 User Classes and Characteristics
- **Anonymous Users**: Can view posts.
- **Registered Users**: Can create, like, and comment on posts after logging in.
- **Administrators**: Can manage users and content (future scope).

#### 2.4 Operating Environment
- Server: Node.js runtime environment
- Database: MongoDB
- Client: Any modern web browser

#### 2.5 Design and Implementation Constraints
- The application will use JWT for authentication.
- MongoDB will be used for data storage.

#### 2.6 Assumptions and Dependencies
- Users have access to a modern web browser.
- The server has Node.js and MongoDB installed.

---

### 3. Specific Requirements

#### 3.1 Functional Requirements

##### 3.1.1 User Registration and Authentication
- **Register User**
  - Endpoint: `POST /api/auth/register`
  - Request Body:
    ```json
    {
      "name": "Sajan Adhikari",
      "email": "sajan@example.com",
      "password": "password123"
    }
    ```
  - Response:
    ```json
    {
      "token": "<JWT>"
    }
    ```

- **Login User**
  - Endpoint: `POST /api/auth/login`
  - Request Body:
    ```json
    {
      "email": "sajan@example.com",
      "password": "password123"
    }
    ```
  - Response:
    ```json
    {
      "token": "<JWT>"
    }
    ```

##### 3.1.2 Post Management
- **Create Post**
  - Endpoint: `POST /api/posts`
  - Request Headers:
    ```json
    {
      "Authorization": "Bearer <JWT>"
    }
    ```
  - Request Body:
    ```json
    {
      "title": "My First Post",
      "content": "This is the content of my first post."
    }
    ```
  - Response:
    ```json
    {
      "_id": "60c72b2f9b1e8a2b3c8f8c9d",
      "title": "My First Post",
      "content": "This is the content of my first post.",
      "user": "60c72b1f9b1e8a2b3c8f8c9c",
      "likes": [],
      "comments": [],
      "date": "2024-05-25T08:56:47.298Z",
      "__v": 0,
      "likesCount": 0,
      "commentsCount": 0
    }
    ```

- **Get All Posts**
  - Endpoint: `GET /api/posts`
  - Response:
    ```json
    [
      {
        "_id": "60c72b2f9b1e8a2b3c8f8c9d",
        "title": "My First Post",
        "content": "This is the content of my first post.",
        "user": "60c72b1f9b1e8a2b3c8f8c9c",
        "likes": [],
        "comments": [],
        "date": "2024-05-25T08:56:47.298Z",
        "__v": 0,
        "likesCount": 0,
        "commentsCount": 0
      }
    ]
    ```

- **Get Post by ID**
  - Endpoint: `GET /api/posts/:id`
  - Response:
    ```json
    {
      "_id": "60c72b2f9b1e8a2b3c8f8c9d",
      "title": "My First Post",
      "content": "This is the content of my first post.",
      "user": "60c72b1f9b1e8a2b3c8f8c9c",
      "likes": [],
      "comments": [],
      "date": "2024-05-25T08:56:47.298Z",
      "__v": 0,
      "likesCount": 0,
      "commentsCount": 0
    }
    ```

- **Update Post by ID**
  - Endpoint: `PUT /api/posts/:id`
  - Request Headers:
    ```json
    {
      "Authorization": "Bearer <JWT>"
    }
    ```
  - Request Body:
    ```json
    {
      "title": "Updated Title",
      "content": "Updated content of the post."
    }
    ```
  - Response:
    ```json
    {
      "_id": "60c72b2f9b1e8a2b3c8f8c9d",
      "title": "Updated Title",
      "content": "Updated content of the post.",
      "user": "60c72b1f9b1e8a2b3c8f8c9c",
      "likes": [],
      "comments": [],
      "date": "2024-05-25T08:56:47.298Z",
      "__v": 0,
      "likesCount": 0,
      "commentsCount": 0
    }
    ```

- **Delete Post by ID**
  - Endpoint: `DELETE /api/posts/:id`
  - Request Headers:
    ```json
    {
      "Authorization": "Bearer <JWT>"
    }
    ```
  - Response:
    ```json
    {
      "msg": "Post removed"
    }
    ```

##### 3.1.3 Post Engagement
- **Like a Post**
  - Endpoint: `PUT /api/posts/like/:id`
  - Request Headers:
    ```json
    {
      "Authorization": "Bearer <JWT>"
    }
    ```
  - Response:
    ```json
    {
      "likesCount": 1,
      "likes": [
        {
          "user": "60c72b1f9b1e8a2b3c8f8c9c",
          "_id": "60c72c3e9b1e8a2b3c8f8c9e"
        }
      ]
    }
    ```

- **Unlike a Post**
  - Endpoint: `PUT /api/posts/unlike/:id`
  - Request Headers:
    ```json
    {
      "Authorization": "Bearer <JWT>"
    }
    ```
  - Response:
    ```json
    {
      "likesCount": 0,
      "likes": []
    }
    ```

- **Comment on a Post**
  - Endpoint: `POST /api/posts/comment/:id`
  - Request Headers:
    ```json
    {
      "Authorization": "Bearer <JWT>"
    }
    ```
  - Request Body:
    ```json
    {
      "text": "This is a comment on the post."
    }
    ```
  - Response:
    ```json
    {
      "commentsCount": 1,
      "comments": [
        {
          "_id": "60c72d1e9b1e8a2b3c8f8c9f",
          "text": "This is a comment on the post.",
          "user": "60c72b1f9b1e8a2b3c8f8c9c",
          "date": "2024-05-25T09:00:30.456Z"
        }
      ]
    }
    ```

- **Delete a Comment**
  - Endpoint: `DELETE /api/posts/comment/:id/:comment_id`
  - Request Headers:
    ```json
    {
      "Authorization": "Bearer <JWT>"
    }
    ```
  - Response:
    ```json
    {
      "commentsCount": 0,
      "comments": []
    }
    ```

---

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance Requirements
- The system should handle up to 100 concurrent users without performance degradation.

#### 3.2.2 Security Requirements
- All user data must be transmitted over HTTPS.
- Password

s must be hashed using a secure algorithm (e.g., bcrypt).
- JWTs must be used for user authentication.

#### 3.2.3 Usability Requirements
- The API should provide clear error messages for invalid requests.
- The system should be intuitive and easy to use for users with basic web browsing experience.

#### 3.2.4 Scalability Requirements
- The system should be easily scalable to accommodate a growing number of users and posts.

---

### 4. Appendices

#### 4.1 API Testing Examples (req.rest)

##### Register User
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Sajan Adhikari",
  "email": "sajan@example.com",
  "password": "password123"
}
```

##### Login User
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "sajan@example.com",
  "password": "password123"
}
```

##### Create Post
```http
POST http://localhost:5000/api/posts
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
  "title": "My First Post",
  "content": "This is the content of my first post."
}
```

##### Like a Post
```http
PUT http://localhost:5000/api/posts/like/60c72b2f9b1e8a2b3c8f8c9d
Authorization: Bearer <your_jwt_token>
```

##### Comment on a Post
```http
POST http://localhost:5000/api/posts/comment/60c72b2f9b1e8a2b3c8f8c9d
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
  "text": "This is a comment on the post."
}
```

---

This SRS document provides a comprehensive overview of the Simple Blog Site project created for learning basics of Node.Js, outlining its scope, requirements, and examples for API testing.

## Created By Sajan Adhikari