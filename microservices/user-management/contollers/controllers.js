const CustomStrategy = require('passport-custom').Strategy;
const { OAuth2Client } = require('google-auth-library');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const dotenv = require('dotenv');
const User = require('../models/user');
const { DateTime } = require('luxon');
const jwt = require('jsonwebtoken');

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.extendLicense = async (req, res) => {
  let user = await User.findOne({
    where: {
      email: req.user.email,
    },
  });
  const prevDateTime = DateTime.fromJSDate(user.licence_expiration);
  let dateTime;
  // check if licence is valid
  if (
    user.licence_expiration &&
    prevDateTime.diffNow('seconds').toObject().seconds > 0
  ) {
    dateTime = prevDateTime.plus({
      days: req.body.extendBy,
    });
  }
  //  check if licence is null or expired
  else {
    dateTime = DateTime.now().plus({
      days: req.body.extendBy,
    });
  }
  user.licence_expiration = dateTime.toISO();
  await user.save();
  res.status(200).json({
    message: `License updated`,
    token: jwt.sign(
      {
        email: req.user.email,
        first_name: user.first_name,
        last_name: req.user.last_name,
        last_login: user.last_login,
        licence_expiration: user.licence_expiration,
        exp: req.user.exp,
      },
      process.env.JWT_SECRET
    ),
  });
};

exports.signInStrategy = new CustomStrategy(async function (req, done) {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  // edw mesa mpainw sto db kai kanw douleai moy
  // kai to license management edw
  const { name, email, exp } = ticket.getPayload();
  try {
    let user = await User.findOne({
      where: {
        email: email,
      },
    });
    //  check if user does not exist
    let last_login_buffer;
    if (!user) {
      user = await User.create({
        email: email,
        first_name: name,
        last_login: new Date(),
        licence_expiration: null,
      });
      last_login_buffer = user.last_login;
    }
    // user already exists
    else {
      last_login_buffer = user.last_login;
      user.last_login = new Date();
      await user.save();
    }
    return done(null, {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      last_login: last_login_buffer,
      licence_expiration: user.licence_expiration,
      exp: exp,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.signInStrategy2 = new JWTstrategy(
  {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  },
  function (token, done) {
    return done(null, {
      email: token.email,
      first_name: token.first_name,
      last_name: token.last_name,
      last_login: token.last_login,
      licence_expiration: token.licence_expiration,
      exp: token.exp,
    });
  }
);
