import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Ensure this matches your backend's base URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Request made and server responded with a status code not in the range of 2xx
      console.error('Error response:', error.response);
      if (error.response.status === 401) {
        // Handle unauthorized access - you can add more logic here
        
        // show alert message to user as well
        alert('Unauthorized access, please login to do this action');
        console.log('Unauthorized access, please login again');


        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error.response.status === 403) {
        // Handle forbidden access
        console.error('Access forbidden');
      } else if (error.response.status === 500) {
        // Handle server errors
        console.error('Server error');
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Error request:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
