const Sequelize = require('sequelize');
let db;

if (process.env.DATABASE_URL) {
  db = new Sequelize(process.env.DATABASE_URL);
} else {
  const credentials = require('./credentials/credentials.js');
  db = new Sequelize({
    database: 'qdot',
    username: credentials.username,
    password: credentials.password,
    dialect: 'postgres',
    logging: false
  });
}

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

//Manager Audit History Schema
const ManagerAudit = db.define('manageraudit', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: Sequelize.STRING
});

//Manager Schema
const Manager = db.define('manager', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  passwordHash: Sequelize.STRING,
  passwordSalt: Sequelize.STRING,
});

//Customer Schema
const Customer = db.define('customer', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING,
  mobile: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  email: Sequelize.STRING,
});

const Reward = db.define('reward', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reservationClaim: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  queueClaim: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
})

//Queue Schema
const Queue = db.define('queue', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  size: Sequelize.INTEGER,
  wait: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  position: Sequelize.INTEGER,
  status: {
    type: Sequelize.STRING,
    defaultValue: 'Waiting'
  },
  removedAt: Sequelize.DATE
});

//Restaurant Schema
const Restaurant = db.define('restaurant', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING,
  phone: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  nextPosition: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  'total_wait': {
    type: Sequelize.INTEGER,
    defaultValue: 10
  },
  'average_wait': {
    type: Sequelize.INTEGER,
    defaultValue: 10
  },
  status: {
    type: Sequelize.STRING,
    defaultValue: 'Closed'
  },
  image: Sequelize.STRING,
  rating: Sequelize.INTEGER,
  reviewCount: Sequelize.INTEGER,
  address: Sequelize.STRING,
  latitude: Sequelize.DOUBLE,
  longitude: Sequelize.DOUBLE,
  yelpID: Sequelize.STRING
});

const Announcement = db.define('announcement', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  message: Sequelize.STRING,
  status: Sequelize.STRING
});

const Menu = db.define('menu', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dish: Sequelize.STRING,
  description: Sequelize.STRING,
  price: Sequelize.INTEGER,
  order: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
});

// Relationship between Restaurant & Queue
Restaurant.hasMany(Queue);
Queue.belongsTo(Restaurant);

// Relationship between Customer & Queue
Customer.hasOne(Queue);
Queue.belongsTo(Customer);

// Relationship between Manager & ManagerAudit
Manager.hasOne(ManagerAudit);
ManagerAudit.belongsTo(Manager);

// Relationship between Manager & Restaurant
Restaurant.hasMany(Manager);
Manager.belongsTo(Restaurant);

// Relationship between Restaurant & Announcement
Restaurant.hasMany(Announcement);
Announcement.belongsTo(Restaurant);

// Relationship between Restaurant & Menu
Restaurant.hasMany(Menu);
Menu.belongsTo(Restaurant);

// Relationship between Cutomer and login credentials
Manager.hasOne(Customer);
Customer.belongsTo(Manager);

// Relationship between Cutomer and login credentials
Manager.hasOne(Reward);
Reward.belongsTo(Manager);

Restaurant.sync()
  .then(() => Manager.sync())
  .then(() => Customer.sync())
  .then(() => ManagerAudit.sync())
  .then(() => Queue.sync())
  .then(() => Announcement.sync())
  .then(() => Menu.sync())
  .then(() => Reward.sync())
  .catch(error => console.log('error syncing data', error));

module.exports = {
  Sequelize,
  db,
  Customer,
  Queue,
  Restaurant,
  Manager,
  ManagerAudit,
  Announcement,
  Menu,
  Reward
};
