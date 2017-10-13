const crypto = require('crypto');
const db = require('../database/index.js');
const Sequelize = require('sequelize');
const helpers = require('../helpers/helpers.js');

const genSalt = function() {
  return crypto.randomBytes(16).toString('hex');
};

const genPassword = function(password, salt) {
  var passwordHash = crypto.createHmac('sha512', salt);
  passwordHash.update(password);
  passwordHash = passwordHash.digest('hex');
  return {
    salt: salt,
    passwordHash: passwordHash
  };
};

const addCustomer = function(name, passwordHash, passwordSalt, mobile, email, username, cb) {
  const formattedMobile = helpers.phoneNumberFormatter(mobile);
  const formattedName = helpers.nameFormatter(name);
  db.Customer.findOrCreate({
    where: {
      mobile: formattedMobile
    },
    defaults: {
      name: formattedName,
      passwordHash: passwordHash,
      passwordSalt: passwordSalt,
      email: email,
      username: username
    }
  }).then(result => {
    cb(result);
  })
    .catch(err => console.error(err));
};

module.exports = {
  genSalt,
  genPassword,
  addCustomer,
};
