/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var classMessages = require('./classes/messages.js');
const querystring = require('querystring');

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.

  // console.log('------------------> Serving request type ' + request.method + ' for url ' + request.url);

  //use request.method to filter by request type
  var statusCode = 200; // used to be 404
  var objectId = 1;
  var createdAt = new Date();

  // if (request.url !== 'classes/messages') {
  //   console.log(request.url);
  //   statusCode = 404;
  // }

  var defaultCorsHeaders = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10 // Seconds.
  };

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  var queryObj = querystring.parse(request.url, '?', '=');
  console.log('query', queryObj);

  if (request.method === 'GET' && request.url.includes('/classes/messages')) {
    
    // check for keys in query obj
    if (Object.keys(queryObj).includes('order')) {
      //sort by the value of the createdat property
      classMessages.messages.results.sort(function(a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.date) - new Date(a.date);
      });
    }
    statusCode = 200;
    response.writeHead(statusCode, headers);

    // response.end(JSON.stringify(classMessages.messages))

    //got to classes/messages and get that data. probably a object with reults  
  } else if (request.method === 'POST' && request.url.includes('/classes/messages')) {
    //push message into classes/messages object 
    console.log('Reaching post');

    statusCode = 201;  
    response.writeHead(statusCode, headers);
    
    var requestBody = '';
    request.on('data', function(data) {
      var parsedData = JSON.parse(data);
      parsedData.createdAt = createdAt;
      parsedData.objectId = objectId;
      objectId++;
      console.log(objectId);
      classMessages.messages.results.push(parsedData);
      console.log('After a post: ', classMessages.messages);
      response.end();
    });


    // response.end();
  } else if (request.method === 'OPTIONS' && request.url.includes('/classes/messages')) {
    statusCode = 200;
    response.writeHead(statusCode, headers);
  }

  // The outgoing status.

  response.writeHead(statusCode, headers);


  // console.log('-------------------------->HEAD', response.writeHead);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  //console.log('our results: ', classMessages.messages);

  response.end(JSON.stringify(classMessages.messages));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


module.exports.requestHandler = requestHandler;

