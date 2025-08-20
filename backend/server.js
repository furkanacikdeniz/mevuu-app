const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const friendshipRoutes = require('./src/routes/friendship');
const authRoutes = require('./src/routes/auth');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/friendships', friendshipRoutes); // <-- Burada prefix önemli

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`SERVER RUNNING PORT ${PORT}`));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

