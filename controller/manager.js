const crypto = require('crypto');
const db = require('../database/index.js');
const Sequelize = require('sequelize');
const yelp = require('../server/yelp.js');

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

const addManager = function(username, passwordHash, passwordSalt, restaurant, location, req, res, cb) {
  //console.log('inside addManager controller fn');
  db.Restaurant.findOne({
    where: { name: restaurant },
    attributes: ['id']
  }).then((result) => {
    if (result) {
      return result;
    } else {
      return yelp.get(req, res, {term: restaurant, location: location, limit: 1})
    }
  })
    .then((restaurant) => {
      console.log('response from yelp: ', restaurant);
      if (restaurant) {
        db.Manager.findOrCreate({
          where: {
            username: username,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            restaurantId: restaurant.id
          }
        })
      } else {
        return null;
      }
    })
    .then(result => {
      //console.log('result of addManager controller fn: ', result);
      if(result !== null) {
      cb(result);
        
      }
    })
    .catch(err => {
      console.log('error adding manager', err);
    });
};

const addAuditHistory = function(type, managerId) {
  return db.ManagerAudit.create({
    type: type,
    managerId: managerId
  });
};

const getAuditHistory = function(restaurantId, cb) {
  db.Restaurant.findOne({
    include: [{
      model: db.Manager,
      attributes: ['id'],
      required: false
    }],
    where: { id: restaurantId }
  }).then(restaurant => {
    return restaurant.managers.map(manager => {
      return manager.id;
    });
  }).then(managerArray => {
    return db.ManagerAudit.findAll({
      include: [{
        model: db.Manager,
        attributes: ['username'],
        required: false
      }],
      order: [['id', 'DESC']],
      where: { managerId: managerArray }
    })
  }).then(results => {
    cb(results);
  })
    .catch(err => {
      console.log('error getting audit history', err);
    });
};

const deleteAuditHistory = function() {
  return db.ManagerAudit.drop().then(() => db.ManagerAudit.sync({force: true}));
};

module.exports = {
  genSalt,
  genPassword,
  addManager,
  addAuditHistory,
  getAuditHistory,
  deleteAuditHistory
};
