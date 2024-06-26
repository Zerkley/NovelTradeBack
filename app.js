var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
var path = require('path');
const m2s = require('mongoose-to-swagger');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var booksRouter = require('./routes/books');
var offersRouter = require('./routes/offers');

const { default: mongoose } = require('mongoose');
const UserModel = require('./models/users_model');
const BookModel = require('./models/books_model');
const OfferModel = require('./models/offers_model');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);
app.use('/offers', offersRouter);

const UserDefinition = m2s(UserModel);
const bookDefinition = m2s(BookModel);
const offerDefinition = m2s(OfferModel);
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'A simple Express API',
    },
    components:{
      schemas:{
        User: UserDefinition,
        Book: bookDefinition,
        Offer: offerDefinition
      }
    }
  },
  apis: ['./routes/*.js'], // path to your route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
main().catch(err => console.error(err));

async function main(){
  await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@prod.u537eha.mongodb.net/prod?retryWrites=true&w=majority&appName=Prod`)
}

module.exports = app;
