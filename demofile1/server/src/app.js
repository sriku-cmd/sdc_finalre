const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const promClient = require('prom-client');
const { createLogger, transports, format } = require('winston');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Logger Setup
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        // Add Logstash transport here if needed
    ]
});

// Prometheus Metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
});

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => logger.info('MongoDB connected'))
    .catch(err => logger.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/password', require('./routes/passwordRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
    res.send('SocioSphere API is running');
});

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
