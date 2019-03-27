var http = require('http');

var net = require('net');
var HOST = '0.0.0.0';
//var HOST = '18.224.27.30';
var PORT = 8080;

var timeReconnect = 5;

var client = new net.Socket();
client.connect(PORT, HOST);

client.on('connect', function() {
    console.log('Conected to: ' + HOST + ':' + PORT);
    client.write('Sender');
});

client.on('data', function(data) {
    try {
        console.log("Sending SMS: "+data);    
    	obj = JSON.parse(data);    

        http.get('http://localhost/api-sms/web/app_dev.php/sms/send?number='+obj.number+'&text='+obj.text, (resp) => {
            resp.on('data', (data) => {
            	console.log('Response: '+data);
            });
        }).on("error", (err) => {
    	  console.log("Error: " + err.message);
    	});
    } catch (error) {
        console.error(error);
    }
});

client.on('close', function() {
    console.log('Connection closed');
});

client.on("end", () => {
    console.log("Connection ended")
    reconnect();
})

client.on('error', function(error) {
    console.log('Socket got problem: ', error.message);
    reconnect();
});

// function that reconnect the client to the server
reconnect = () => {
    setTimeout(() => {
        //client.removeAllListeners(); // the important line that enables you to reopen a connection
        client.connect(PORT, HOST);
    }, timeReconnect*1000);
}