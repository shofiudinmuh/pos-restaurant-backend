const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

//middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

//routes

// error handling

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is runnung on port ${PORT}`));
