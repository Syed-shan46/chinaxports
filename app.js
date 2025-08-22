var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const helpers = require('./helpers/helper');
var app = express();
require('dotenv').config();
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret', // Use env variable in production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set true if HTTPS
}));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var exphbs = require('express-handlebars');
var productsRouter = require('./routes/product');
var adminRouter = require('./routes/admin');
const searchRouter = require('./routes/search');
const storeRouter = require('./routes/store');
const adminAuthMiddleware = require('./middlewares/adminAuth');
const categoryMiddleware = require('./middlewares/category');
const connectDB = require('./db');
app.use(categoryMiddleware);


connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to fetch categories for all views
// app.use(async (req, res, next) => {
//   try {
//     const categories = await Category.find().sort({ name: 1 }).lean();
//     res.locals.categories = categories;
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/admin', adminAuthMiddleware, adminRouter);
app.use('/search', searchRouter);
app.use('/store', storeRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views/layout'),   // ✅ correct
  partialsDir: path.join(__dirname, 'views/partials'),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: helpers,
}));



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
