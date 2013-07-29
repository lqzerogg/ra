var wsClient = (function() {
    var websocket,
        connected = false,
        respCallback
    this.doConnect = function(wsURI){
        if (connected) {
            console.log("<span style='color:red;'>You're already connected!</span>")
        } else {
            websocket = new WebSocket(wsURI, 'echo-protocol')
            websocket.onopen = function(evt) { onOpen(evt) }
            websocket.onclose = function(evt) { onClose(evt) }
            websocket.onmessage = function(evt) { onMessage(evt) }
            websocket.onerror = function(evt) { onError(evt) }
            console.log("CONNECTION REQUESTED ....")
        }
    }
    function onOpen (evt) {
        connected = true;
        console.log("CONNECTED")
    }
    function onClose (evt) {
        connected = false;
        websocket.close();
        console.log("DISCONNECTED")
    }
    function onMessage (evt) {
        if (respCallback && typeof(respCallback) === 'function') {
            respCallback(evt.data)
        } else {
            console.log("<span style='color: blue;'>RESP: " + evt.data + "</span>")
        }
    }
    function onError (evt) {
      console.log("<span style='color:red;'>ERROR:</span> " + evt.data)
    }
    this.doSend = function(msg, rcb)
    {
        if (connected) {
            respCallback = rcb
            websocket.send(msg)
            console.log("SENT: " + msg)
            /*
            { // binary
                size = msg.length;
                var ba = new Uint8Array(size);
                for (var i=0; i<size; i++) {
                    ba[i] = msg.charCodeAt(i);
                }
                m = ba.buffer;
                websocket.send(m);
                console.log("SENT: binary message");
            }
            */
        } else {
            console.log("<span style='color: red;'>NOT CONNECTED: No message sent.</span>")
        }
    }
    this.doClose = function() {
        if (connected) {
            console.log("CLOSING ....")
            websocket.close()
            connected=false
        } else {
            console.log("<span style='color: red;'>NOT CONNECTED</span>")
        }
    }

    return this
})()