const axios = require('axios');
axios.post('http://localhost:3000/api/auth/register', {
  firstName: "Test",
  lastName: "User",
  email: "test2@example.com",
  password: "password123"
}).then(res => console.log(res.data)).catch(err => console.error(err.response.data));
