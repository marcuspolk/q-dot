const db = require('../database/index.js');
const dbQuery = require('../controller/index.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const dbCustomerQuery = require('../controller/customer.js');

passport.use(new LocalStrategy(
  function(username, password, done) {
    dbQuery.getCustomerLoginInfo(username)
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'incorrect username' });
        }
        var inputPassword = dbCustomerQuery.genPassword(password, user.passwordSalt);
        if (user.passwordHash !== inputPassword.passwordHash) {
          return done(null, false, { message: 'incorrect password' });
        }
        return done(null, user);
      })
      .catch(err => done(err));
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializing user: ', id);
  db.Customer.findById(id)
  .then(user => {
    done(null, user);
  })
  .catch(err => done(err, null));
});

const passportCustomer = (req, res) => {
  passport.initialize();
  passport.session();
  passport.authenticate('local', {
    successRedirect: '/customer',
    failureRedirect: '/'
  });
};

module.exports = passportCustomer;
