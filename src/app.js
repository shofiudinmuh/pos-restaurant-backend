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
// sequelize
//     .sync({ force: false })
//     .then(() => {
//         console.log('Database synced');
//         const PORT = process.env.PORT || 5000;
//         app.listen(PORT, () => console.log(`Server is runnung on port ${PORT}`));
//     })
//     .catch((err) => {
//         console.log('Unable to sync database', err);
//     });
async function initializeDatabase() {
    try {
        // Drop the view first if it exists
        await sequelize.query('DROP VIEW IF EXISTS transaction_report');

        // Sync models
        await sequelize.sync({ alter: true });

        // Recreate the view
        await sequelize.query(`
            CREATE OR REPLACE VIEW transaction_report AS
            SELECT o.outlet_id,
                o.created_at::date AS transaction_date,
                count(o.order_id) AS total_orders,
                sum(o.subtotal) AS total_subtotal,
                sum(COALESCE((SELECT sum(ot.tax_amount) AS sum
                    FROM order_taxes ot
                    WHERE ot.order_id = o.order_id), 0::numeric)) AS total_tax,
                sum(COALESCE((SELECT d.value
                    FROM discounts d
                    WHERE d.discount_id = o.discount_id), 0::numeric)) AS total_discount,
                sum(o.total_amount) AS total_amount,
                sum(o.paid_amount) AS total_paid,
                sum(o.change_amount) AS total_change,
                p.payment_method,
                count(p.payment_id) AS payment_count
            FROM orders o
                LEFT JOIN payments p ON p.order_id = o.order_id
            WHERE o.status::text = 'completed'::text
            GROUP BY o.outlet_id, (o.created_at::date), p.payment_method
        `);

        console.log('Database synchronized successfully');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    } catch (err) {
        console.error('Unable to sync database:', err);
        process.exit(1); // Exit with failure
    }
}

// Initialize database and start server
initializeDatabase();
