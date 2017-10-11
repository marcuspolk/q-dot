const db = require('./index.js');

const obj = {
  dummyQueues: []
};

const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// randomDate(new Date(2012, 0, 1), new Date());

const addDays = (days, oldDate) => {
  let newDate = new Date(oldDate);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

const addToQueue = () => {
  let today = new Date();
  let startDate = new Date(2017, 0, 1);
  let days = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

  let queueInfo = {
    restaurantId: 1,
    wait: 10,
    position: 1,
    customerId: 2
  };

  for (let i = 0; i < days; i++) {
    let queueDate = addDays(i, startDate);
    for (let j = 0; j < 100; j++) {
      let randomSize = Math.ceil(Math.random() * 7);
      queueInfo.size = randomSize;

      let randomStatus = Math.floor(Math.random() * 10);
      randomStatus ? queueInfo.status = 'Seated' : queueInfo.status = 'No Show';

      let hours = (Math.random() * 12 | 0) + 8;
      let minutes = Math.random() * 60 | 0;
      let seconds = Math.random() * 60 | 0;

      let createdDate = new Date(queueDate);
      createdDate.setHours(hours);
      createdDate.setMinutes(minutes);
      createdDate.setSeconds(seconds);

      queueInfo.createdAt = new Date(createdDate);
      queueInfo.removedAt = new Date(createdDate.getTime() + (Math.random() * 1000 * 60 * 60));

      obj.dummyQueues.push(queueInfo);
      db.Queue.create(queueInfo);
    }
  }
};

module.exports = addToQueue;
