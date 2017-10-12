const db = require('../database/index.js');
const Sequelize = require('sequelize');

const getMenuForRestaurant = (restaurantId) => {
  return db.Menu.findAll({
    where: { restaurantId: restaurantId }
  });
};

const addMenuItem = (restaurantId, menuObj) => {
  return db.findOrCreate({
    where: menuObj // menu obj should look like: {dish: '', description: '', restaurantId: 0}
  });
};

const removeMenuItem = (menuId) => {
  return db.Menu.destroy({
    where: { id: menuId }
  });
};

const updateMenu = (menuId, field, newVal) => {
  return db.Menu.update({[field]: newVal}, {where: {id: menuId}});
}

module.exports = {
  getMenuForRestaurant,
  addMenuItem,
  removeMenuItem,
  updateMenu
};
