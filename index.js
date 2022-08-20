require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const sequelize = require('./db');
const cors = require('cors');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const fileUpload = require('express-fileupload');
const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(
  cors({
    origin: true,
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
    credentials: true,
    preflightContinue: true,
  }),
);
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(cookieParser());
app.use(fileUpload({}));
app.use('/api', router);

// Must be last middleware
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log('Starting server on port ' + PORT));
  } catch (e) {
    console.log(e);
  }
};

start();
