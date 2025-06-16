const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models');
const routes = require('./routes/v1');
const errorMiddleware = require('./middleware/errorMiddleware');
const apiLogMiddleware = require('./middleware/apiLogMiddleware');
const ApiResponse = require('./utils/responseHandler');

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: (req, res, next) => {
        ApiResponse.error(res, 'Too many requests, please try again later', 429);
    },
});

//middlewares
app.use(limiter);
app.use(helmet());
app.use(
    cors({
        origin:
            process.env.NODE_ENV === 'production' ? 'http://domain.com' : 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.use(express.json());
app.use(morgan('combined'));
app.use(apiLogMiddleware);

// api versioning
app.use(`/api/${process.env.API_VERSION}`, routes);

// health check
app.get('/health', (req, res) => {
    ApiResponse.success(
        res,
        {
            status: 'healthy',
        },
        'API is running'
    );
});

// error handling
app.use(errorMiddleware);

// database sync
sequelize
    .sync({ force: false })
    .then(() => {
        console.log('Database synced');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server is runnung on port ${PORT}`));
    })
    .catch((err) => {
        console.log('Unable to sync database', err);
    });
