const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const cors = require('cors')
const { kafkaController } = require('./controllers/KafkaController');
const { getData } = require('./controllers/AGPTControllers');
const passport = require('passport');
const { DateTime } = require('luxon');
const createHttpError = require('http-errors');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Setup JWT authentication
passport.use(
  new JwtStrategy(
    { 
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    }, 
    function (payload, done) {
      // Check if the user's licence has expired
      if (DateTime.fromISO(payload.licence_expiration) < DateTime.now()) {
        return done(createError(401, 'Licence has expired'));
      }
      return done(null, true);
    }
  )
)

// Connect to Kafka event bus
kafkaController().catch(console.error);

// GET AGPT data for a country, selecting the production type and time range.
app.get('/getData/:country_ID/:production_type/:dateFrom/:dateTo',
  passport.authenticate('jwt', { session: false }),
  getData
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// log errors
app.use(function (err, req, res, next) {
  const status = err.status || 500
  if (status >= 500) {
    console.error(err.stack);
  }
  next(err);
})

// error handler
app.use(function(err, req, res, next) {
  const status = err.status || 500;
  res.status(status);
  const message = status >= 500 ? "Internal Error" : err.message;
  const expose = status >= 500 && req.app.get('env') === 'development';
  res.end(expose ? message + '\n\n' + err.stack : message)
});

module.exports = app;