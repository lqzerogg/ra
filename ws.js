var WebSocketServer = require('websocket').server,
    http = require('http'),
    url = require('url'),
    spawn = require('child_process').spawn,
    db = require('./db')

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(3125, function() {
    console.log((new Date()) + ' Server is listening on port 3215');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    console.log(request.origin)
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            var path = url.parse(message.utf8Data, true)
            if (typeof commands[path.pathname] === 'function') {
                commands[path.pathname].call(connection, path.query)
            }
        }
        // else if (message.type === 'binary') {
        //     console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        //     connection.sendBytes(message.binaryData);
        // }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

var commands = {
    'save-task': function(query) {
        var conn = this
        db.saveTask(query['task-name'], query['code-version'], query['task-id'], function(result) {
            conn.sendUTF(result.insertId)
        })
    },
    'export-code': function(query) {
        var conn = this
        var sp = spawn('ssh', ['192.168.62.6', ' ./test.sh'])
        sp.stdout.on('data', function(data) {
            conn.sendUTF(data)
        })
        sp.stdout.on('end', function() {
            conn.sendUTF('Completed!!')
        })
    }
}