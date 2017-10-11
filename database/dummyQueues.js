const db = require('./index.js');
const dbQuery = require('../controller/index.js');

const addToQueue = () => {
  return dbQuery.addToQueue({name: 'BoJack', restaurantId: 1, size: 3, mobile: '9485739385', email: 'bojack@gmail.com', createdAt: '2017-10-01 15:53:24.866-07', updatedAt: '2017-10-01 16:03:24.866-07'})
    .catch(err => {
      console.log('error adding dummy data to queue', err);
    });
};

module.exports = addToQueue;
