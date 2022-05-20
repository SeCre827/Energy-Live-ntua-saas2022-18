const CustomStrategy = require('passport-custom').Strategy;
const { OAuth2Client } = require('google-auth-library');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const dotenv = require('dotenv');
const User = require('../models/user');

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.signInStrategy = new CustomStrategy(async function (req, done) {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  console.log(ticket);
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
        licence_expiration: '2023-01-08',
      });
      last_login_buffer = user.last_login;
      console.log('user built');
    }
    // user already exists
    else {
      last_login_buffer = user.last_login;
      user.last_login = new Date();
      await user.save();
    }
    return done(null, {
      email: user.email,
      name: user.first_name,
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
      name: token.name,
      email: token.email,
      picture: token.picture,
      exp: token.exp,
    });
  }
);
