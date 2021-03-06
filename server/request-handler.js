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

  //use request.method to filter by request type
  var statusCode = 404; // used to be 404
  var objectId = 0;
  var createdAt = new Date();
  
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

  if (request.method === 'GET' && request.url.includes('/classes/messages')) {
    
    var copiedArray = classMessages.messages.results.slice();
    
    if (queryObj.order === '-createdAt') {
      copiedArray.reverse();
    }
    
    statusCode = 200;
    response.writeHead(statusCode, headers);

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
      var resultsArray = classMessages.messages.results;
      if (resultsArray.length === 0) {
        parsedData.objectId = 0;
        
      } else { 
        var newId = resultsArray[resultsArray.length - 1].objectId;        
        parsedData.objectId = newId + 1;
      }
      classMessages.messages.results.push(parsedData);
      response.end();
    });

  } else if (request.method === 'OPTIONS' && request.url.includes('/classes/messages')) {
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end();
  }

  // The outgoing status.

  response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  //console.log('our results: ', classMessages.messages);
  response.end(JSON.stringify({results: copiedArray})); 
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

