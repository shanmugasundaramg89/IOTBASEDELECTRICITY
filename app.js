const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const cors = require('cors');

const indexRouter = require('./routes/index');
const searchRouter = require('./routes/search');
const restRouter = require('./routes/rest');

const app = express();
 

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(cors({origin: '*'}));

app.use(indexRouter);
app.use('/search', searchRouter);
app.use('/rest', restRouter);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(function(req, res, next) {
    // catch 404 and forward to error handler
    next(createError(404));
  });
  app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
  });
  
  module.exports = app;