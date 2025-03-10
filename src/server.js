const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const communityRoutes = require('./routes/communityRoutes');
const memberRoutes = require('./routes/memberRoutes');

// Middleware Imports
const authMiddleware = require('./middlewares/authMiddleware');

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log(" MongoDB Connected"))
  .catch(err => console.error(" MongoDB Connection Failed:", err));

// Routes
app.use('/v1/auth', authRoutes);
app.use('/v1/role', roleRoutes);
app.use('/v1/community', communityRoutes);
app.use('/v1/member', memberRoutes);

// Protected Route Example
app.get('/v1/protected', authMiddleware, (req, res) => {
  res.json({ message: "You have accessed a protected route!", user: req.user });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
