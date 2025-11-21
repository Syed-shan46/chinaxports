// Core modules and dependencies
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const helpers = require('./helpers/helper');
require('dotenv').config();

// Routers and custom modules
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/product');
const storeRouter = require('./routes/store');
const adminRouter = require('./routes/admin');
const searchRouter = require('./routes/search');
const cartRouter = require('./routes/cart');
const adminAuthMiddleware = require('./middlewares/adminAuth');
const categoryMiddleware = require('./middlewares/category');
const connectDB = require('./db');

// Initialize express app
const app = express();

// Database connection
connectDB();

// Session middleware (set secret from env, update cookie.secure for HTTPS in production)
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}));

// Category middleware (fetches categories, attach to res.locals if needed)
app.use(categoryMiddleware);

// Logger and core middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
const exphbs = require('express-handlebars');
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views/layout'),
  partialsDir: path.join(__dirname, 'views/partials'),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: helpers,
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/admin', adminAuthMiddleware, adminRouter);
app.use('/search', searchRouter);
app.use('/store', storeRouter);
app.use('/cart',cartRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler (must be last middleware)
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Export the app
module.exports = app;
