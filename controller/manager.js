const crypto = require('crypto');
const db = require('../database/index.js');

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

const addManager = function(username, passwordHash, passwordSalt) {
  return db.Manager.findOrCreate({
    where: {
      username: username,
      passwordHash: passwordHash,
      passwordSalt: passwordSalt
    }
  });
};

const addAuditHistory = function(type, managerId) {
  return db.ManagerAudit.create({
    type: type,
    managerId: managerId
  });
};

const getAuditHistory = function() {
  return db.ManagerAudit.findAll({
    include: [{
      model: db.Manager,
      attributes: ['username'],
      required: false
    }]
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
