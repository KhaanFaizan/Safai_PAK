const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.JWT_SECRET) {
    console.error('CRITICAL ERROR: JWT_SECRET is NOT defined. Authentication WILL FAIL.');
}

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: [
        "https://appealing-mindfulness-production.up.railway.app",
        "http://localhost:5173",
        "http://localhost:4173"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/reviews', reviewRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} `);
});
