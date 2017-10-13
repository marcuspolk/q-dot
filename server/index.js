const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const port = process.env.PORT || 1337;
const db = require('../database/index.js');
const dbQuery = require('../controller/index.js');
const dbManagerQuery = require('../controller/manager.js');
const dbMenuQuery = require('../controller/menu.js');
const dummyData = require('../database/dummydata.js');
const helpers = require('../helpers/helpers.js');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const passport = require('./passport.js');
const dummyQueues = require('../database/dummyQueues.js');
const yelp = require('./yelp.js');
const sendSMS = require('../helpers/sms.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//checks if session already exists, if it does, adds req.session to req object
app.use(session({
  store: new RedisStore({
    host: process.env.REDISURL || '104.237.154.8',
    port: process.env.REDISPORT || 6379
  }),
  secret: process.env.SESSIONSECRET || 'nyancat',
  cookie: {
    maxAge: 18000000
  },
  name: 'qsessionid',
  resave: false
}));

//these middlewares initialise passport and adds req.user to req object if user has aleady been authenticated
app.use(passport.initialize());
app.use(passport.session());

//this is to check if manager is logged in, before using static middleware. MUST always be above express.static!
app.get('/manager', (req, res, next) => {
  if (req.user) {
    if (!req.query.restaurantId) {
      res.redirect(`/manager?restaurantId=${req.user.restaurantId}`);
    } else {
      next();
    }
  } else {
    res.redirect('/managerlogin');
  }
});

app.get('*/queueInfo', (req, res, next) => {
  if (req.session.queueInfo) {
    if (!req.query.queueId) {
      res.redirect(`/customer/queueInfo?queueId=${req.session.queueInfo.queueId}`);
    } else {
      next();
    }
  } else {
    res.redirect('/customer');
  }
});

app.use(express.static(path.resolve(__dirname, '../client/dist')));

//this shows how you can get queue information from the cookie of a customer who has already queue up
// app.use((req, res, next) => {
//   if (req.session.queueInfo) {
//     console.log(req.session.queueInfo);
//   }
//   next();
// });


//get info for one restaurant or all restaurants
app.get('/restaurants', (req, res) => {
  if (req.query.restaurantId) {
    dbQuery.findInfoForOneRestaurant(req.query.restaurantId)
      .then(results => res.send(results))
      .catch(error => {
        console.log('error getting info for one restaurants', error);
        res.send('failed for one restaurant');
      });
  } else {
    dbQuery.findInfoForAllRestaurants()
      .then(restaurants => res.send(restaurants))
      .catch(error => {
        console.log('error getting info for all restaurants', error);
        res.send('failed for info on all restaurants');
      });
  }
});


app.get('*/menu/:restaurantId', (req, res) => {
  dbMenuQuery.getMenuForRestaurant(req.params.restaurantId)
    .then(results => {
      res.send(results);
    })
    .catch(err => {
      console.log('error getting menu for restaurant', err);
    });
});

app.delete('*/menu/:menuId', (req, res) => {
  if (req.user) {
    dbMenuQuery.removeMenuItem(req.params.menuId)
      .then(results => {
        res.sendStatus(200);
      })
      .catch(err => {
        console.log('error deleting menu item', err);
      });
  } else {
    res.sendStatus(418);
  }
});

app.put('*/menu/:menuId', (req, res) => {
  if (req.user) {
    dbMenuQuery.updateMenu(req.params.menuId, req.query.field, req.query[req.query.field])
      .then(results => {
        res.sendStatus(201);
      })
      .catch(err => {
        console.log('error updating menu item', err);
      });
  } else {
    res.sendStatus(418);
  }
});

app.post('*/menu/:restaurantId', (req, res) => {
  // req.query should look like: {dish: '', description: '', price: 0, restaurantId: 0}
  let menuObj = {
    dish: req.query.dish,
    description: req.query.description,
    price: req.query.price,
    restaurantId: req.params.restaurantId
  };
  if (req.user) {
    dbMenuQuery.addMenuItem(menuObj)
      .then(results => {
        res.sendStatus(201);
      })
      .catch(err => {
        console.log('error adding menu item', err);
      });
  } else {
    res.sendStatus(418);
  }
});


// handle announcements for restaurants.
/*
    check auth for post requests. should be a manager of the restaurant.
    only send inactive messages if manager auth present.
    for now put code in here. after finishing, move it to controller/index.js
  */

app.get('/restaurant/:id/announcements', (req, res) => {
  var id = req.params.id;
  db.Announcement.findAll({where: {restaurantId: id}}).then(announcements => {
    res.json(announcements);
  })
    .catch(err => {
      console.log('error getting announcements');
      res.send(`error getting announcements ${err}`);
    });
});

app.post('/restaurant/:id/announcements', (req, res) => {
  var id = Number(req.params.id);

  if (req.user && req.user.restaurantId === id) {
    var message = req.body.message;
    var status = req.body.status;
    db.Announcement.findOrCreate({where: {restaurantId: id, message: message, status: status}})
    .then((data) => res.status(201).send(data))
    .catch((err) => res.status(400).send(`ERROR: ${err}`));
   } else {
     res.status(401).send('Error authenticating ')
    }
});

app.patch('/announcements/:id', (req, res) => {

  var message = req.body.message;
  var status = req.body.status;
  db.Announcement.findOne({where: {id: req.params.id}})
  .then(ann => {
    if (ann.restaurantId !== req.user.restaurantId) {
      res.status(401).send('nope')
      throw('not authenticated');}
    else return ann.update({message: message, status: status})
  })
  .then(db.Announcement.findOne({where: {id: req.params.id}}))
  .then(updatedAnn => res.json(updatedAnn))
  .catch(err => {
    console.log('err with patching announcement:', err)
    res.status(400).send('something went wrong')});
});

app.delete('/announcements/:id', (req, res) => {
  db.Announcement.findOne({where: {id: req.params.id}})
  .then(ann => {
    if (ann.restaurantId === Number(req.user.restaurantId)) ann.destroy()
    else {
      throw('invalid auth with announcement deletion.')
    }
  })
  .then(() => res.status(200).send('OK'))
  .catch(err => {
    console.log(err);
    res.status(400).send('Something went wrong trying to delete the announcement')
  });
})


//drop database and add dummy data
app.post('/dummydata', (req, res) => {
  dummyData.dropDB()
    .then(() => {
      res.sendStatus(200);
    })
    .catch(error => {
      console.log('error posting dummydata', error);
      res.send('could not add dummydata');
    });
});

// Route handler for adding dummy queue data
app.post('/dummyqueues', (req, res) => {
  dummyQueues();
  res.send(200);
});

//add a customer to the queue at a restaurant
app.post('/queues', (req, res) => {
  if (!req.body.name || !req.body.mobile || !req.body.restaurantId
      || !req.body.size) {
    res.status(400).send('Bad Request');
  } else {
    dbQuery.addToQueue(req.body)
      .then(response => {
        const result = {
          name: helpers.nameFormatter(req.body.name),
          mobile: helpers.phoneNumberFormatter(req.body.mobile)
        };
        if (req.body.email) {
          result.email = req.body.email;
        }
        result.queueId = response.queueId;
        result.size = response.size;
        result.position = response.position;
        result.queueInFrontCount = response.queueCount;
        result.wait = response.wait;
        result.queueInFrontList = response.queueList;
        req.session.queueInfo = result;
        res.send(result);
        //automatically update manager side client
        socketUpdateManager(req.body.restaurantId);
      })
      .catch(err => {
        if (err.message.includes('closed')) {
          res.send(err.message);
        } else if (err.message.includes('added')) {
          res.send(err.message);
        } else {
          console.log('error during post for queue', err);
          res.status(418).send('Request Failed');
        }
      });
  }
});

//update the status of a restaurant
app.patch('/restaurants', (req, res) => {
  if (req.query.status && (req.query.status === 'Open' || req.query.status === 'Closed')) {
    dbQuery.updateRestaurantStatus(req.query)
      .then(result => res.send(`Status for restaurant with id ${req.query.restaurantId} is now ${req.query.status}`))
      .catch(err => res.status(418).send('Update for restaurant status failed'));
  } else {
    res.status(400).send('Bad Request');
  }
});

//get queue info
app.get('/queues', (req, res) => {
  if (req.query.queueId) {
    var results = {};
    dbQuery.getCustomerInfo(req.query.queueId)
      .then(partialResults => {
        results.name = partialResults.customer.name;
        results.mobile = partialResults.customer.mobile;
        results.email = partialResults.customer.email;
        results.queueId = partialResults.id;
        results.size = partialResults.size;
        results.position = partialResults.position;
        results.wait = partialResults.wait;
        results.restaurant = partialResults.restaurant;
        return dbQuery.getQueueInfo(partialResults.restaurantId, partialResults.customerId, partialResults.position);
      })
      .then(partialResults => {
        results.queueInFrontCount = partialResults.count;
        results.queueInFrontList = partialResults.rows;
        res.send(results);
      })
      .catch(err => {
        res.status(418).send('Unknown Error - Check customerId');
      });
  } else {
    res.status(400).send('Bad request');
  }
});

//remove customer from queue at a restaurant
app.put('/queues', (req, res) => {
  if (!req.query.queueId) {
    res.status(400).send('Bad Request');
  } else {
    if (req.body.status === 'Ready') {
      db.Queue.find({where: {id: req.query.queueId}, include: [db.Restaurant, db.Customer]})
        .then(row => {
          return sendSMS(row.customer.mobile, row.restaurant.name, row.customer.name);
        })
        .then(() => {
          return dbQuery.removeFromQueue(req.query.queueId, req.body.status);
        })
        .then(result => {
          res.send(result);
        })
        .catch(err => {
          console.log('Error removing seated customer from queue', err);
          res.sendStatus(418);
        });
    } else {
      dbQuery.removeFromQueue(req.query.queueId, req.body.status)
        .then(result => res.send(result))
        .catch(err => {
          if (err.message.includes('removed')) {
            res.send(err.message);
          } else {
            console.log('error when removing from queue', err);
            res.status(418).send('Request Failed');
          }
        });
    }
  }
});

app.patch('/queues', (req, res) => {
  dbQuery.updateQueue(req.query.queueId, req.query.position)
    .then(results => {
      res.sendStatus(201);
    })
    .catch(err => {
      console.log('Error updating queue', err);
      res.status(418).send('Request Failed');
    });
});

//login a manager for a restaurant
app.post('/managerlogin', passport.authenticate('local'), (req, res) => {
  if (req.user.restaurantId) {
    dbManagerQuery.addAuditHistory('LOGIN', req.user.id)
      .then(results => {
        res.send(`/manager?restaurantId=${req.user.restaurantId}`);
      });
  } else {
    res.sendStatus(401);
  }
});

app.post('/customerlogin', passport.authenticate('local'), (req, res) => {
  if (!req.user.restaurantId) {
    res.send('/customer');
  } else {
    res.sendStatus(401);
  }
});

//request for logout of manager page of a restaurant
app.get('/logout', (req, res) => {
  dbManagerQuery.addAuditHistory('LOGOUT', req.user.id)
    .then(results => {
      req.logout();
      res.redirect('/managerlogin');
    });
});

app.post('/manager', (req, res) => {
  //console.log('request', req.query);
  // if (req.user) {
    //console.log('inside POST req to /manager');
    if (!req.query.password || !req.query.username || !req.query.restaurant || !req.query.location) {
      res.sendStatus(400);
    } else {
      var passwordInfo = dbManagerQuery.genPassword(req.query.password, dbManagerQuery.genSalt());
      dbManagerQuery.addManager(req.query.username, passwordInfo.passwordHash, passwordInfo.salt, req.query.restaurant, req.query.location, req, res, (results) => {
        //console.log('inside POST req to /manager; result from manager controller: ', results);
        if (results) {
          res.send(results)
        } else {
          var params = {
            term: req.query.restaurant,
            location: req.query.location,
            limit: 1
          };
          //console.log('calling yelp helper fn with: ', params);
          // yelp.get(req, res, params);
        }
      });
    }
  // } else {
  //   res.sendStatus(401);
  // }
});

app.post('/customer', (req, res) => {
  if (!req.query.password || !req.query.mobile || !req.query.username) {
    res.sendStatus(400);
  } else {
    var passwordInfo = dbManagerQuery.genPassword(req.query.password, dbManagerQuery.genSalt());
    dbManagerQuery.addCustomer(req.query.username, passwordInfo.passwordHash, passwordInfo.salt, (results) => {
      dbQuery.findOrAddCustomer({
        managerId: results[0].id,
        name: req.query.name,
        mobile: req.query.mobile,
        email: req.query.email
      })
        .then((result) => {
          res.send(result);
        });
    });
  }
});

//add route to manager/:restaurant
// on successful login/signup, redirect to manager/:restaurant

//returns up to 10 suggested restaurant objects based on term and location
app.get('/yelp', (req, res) => {
  var params = {
    term: req.query.term,
    location: req.query.location,
    limit: 10
  };
  yelp.get(req, res, params);
});

//returns manager login/logout history
app.get('/manager/history', (req, res) => {
  if (req.user) {
    dbManagerQuery.getAuditHistory(req.user.restaurantId, (results) => {
      res.send(results);
    });
  } else {
    res.sendStatus(401);
  }
});

//deletes manager login/logout history
app.delete('/manager/history', (req, res) => {
  if (req.user) {
    dbManagerQuery.deleteAuditHistory().then(results => res.send(results));
  } else {
    res.sendStatus(401);
  }
});

app.get('*', (req, res) => {
  console.log('doing stuff');
  if (req.session.queueInfo) {
    console.log('gets here');
    res.redirect(`/customer/queueinfo?queueId=${req.session.queueInfo.queueId}`);
  } else {
    res.redirect('/customer');
  }
});

server.listen(port, () => {
  console.log(`(>^.^)> Server now listening on port ${port}!`);
});

let queueMap = {};// queueId: socketId
let managerMap = {};// restaurantId: socketId

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
  });

  //manager event
  socket.on('manager report', (restaurantId) => {
    console.log(`restaurantId: ${restaurantId} manager reporting with socket id: ${socket.id}`);
    managerMap[restaurantId] = socket.id;
  });

  socket.on('noti customer', (queueId) => {
    if (queueMap[queueId]) {
      io.to(queueMap[queueId]).emit('noti', 'your table is ready!');
    }
  });

  //customer event
  socket.on('customer report', (queueId) => {
    console.log(`queueId: ${queueId} customer reporting with socket id: ${socket.id}`);
    queueMap[queueId] = socket.id;
  });
});

// send message to manager client to update the queue
const socketUpdateManager = (restaurantId) => {
  if (managerMap[restaurantId]) {
    io.to(managerMap[restaurantId]).emit('update', 'queue changed');
  }
};
