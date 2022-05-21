// const createError = require('http-errors');
const express = require('express');
// const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const jwt = require('jsonwebtoken');
// const { Console } = require('console');
const controllers = require('./contollers/controllers');
const sequelize = require('./utils/database');

dotenv.config();

const port = 5000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.options('/signin', cors());
app.options('/signout', cors());
// sign in
passport.use('signin', controllers.signInStrategy);

passport.use('token', controllers.signInStrategy2);

app.post(
  '/signin',
  cors(),
  passport.authenticate('signin', { session: false }),
  function (req, res) {
    console.log('LOGIN');
    console.log(process.env.JWT_SECRET);
    res.json({
      token: jwt.sign(req.user, process.env.JWT_SECRET),
    });
  }
);

app.post(
  '/extend-licence',
  passport.authenticate('token', { session: false }),
  controllers.extendLicense
);

app.post(
  '/signout',
  cors(),
  passport.authenticate('token', { session: false }),
  function (req, res) {
    console.log('LOGOUT');
    res.status(200).send();
  }
);

// Global error handler
app.use((error, req, res) => {
  res.status(error.httpStatusCode || 500).json({
    ErrorMessage: error.message,
  });
  console.log('Global error handler');
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Succesfully conected to DB');
    console.log(`Server Listening  on Port: ${port}`);
    app.listen(port);
  })
  .catch((error) => {
    console.log('From error Logger at app: ', error.message);
  });
