const jwt = require('jsonwebtoken');
const { DateTime } = require('luxon');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  console.log(token);
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'energy-live');
    console.log(decodedToken);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  // Check if he has days left at licence
  if (
    !decodedToken.licence_expiration ||
    DateTime.fromISO(decodedToken.licence_expiration) < DateTime.now()
  ) {
    const error = new Error('Licence has expired.');
    error.statusCode = 401;
    throw error;
  }

  next();
};
