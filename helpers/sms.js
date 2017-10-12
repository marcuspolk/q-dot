var request = require('request');

const sendSMS = (number, restaurant, name) => {
  // request.post('http://127.0.0.1:9090/text', {
  //   number: number,
  //   message: 'Hello from SPLASM',
  // }, function(err, httpResponse, body) {
  //   if (err) {
  //     console.error('Error:', err);
  //     return;
  //   }
  //   console.log(JSON.parse(body));
  // });

  var options = {
      headers: {'content-type' : 'application/json'},
      url: 'http://127.0.0.1:9090/text',
      method: 'POST',
      form: {
        number: number,
        message: `Hello ${name}! Your table is ready at ${restaurant}!`
      }
  };

  function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
          console.log(body);
          return;
      }
      console.log(response);
  }

  request(options, callback);
};

module.exports = sendSMS;
