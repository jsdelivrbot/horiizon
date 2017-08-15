var express = require('express');
var socket = require('socket.io');
var http = require('http');
var events = require('events');

var app = express();
var PORT = process.env.PORT || 8080;
var waitingPlayer;

app.set('port', (PORT));
app.use(express.static(__dirname + '/public_html'));

var server = http.createServer(app);
var io = socket(server);


// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



app.get('/about.html', function (req, res) {
    res.send('hello');
});

app.get('/', function (request, response) {
    response.send('Whats up? from horiizon World');
});



io.on('connection', onConnect);

io.on('disconnect', onDisconnect);



server.listen(PORT, function () {
    console.log('Server listening: ' + PORT);
});



//app.listen(app.get('port'), function () {
//    console.log('Node app is running on port', //app.get('port'));
//});

function onConnect(sock) {  
    sock.emit('msg', 'Welcome to Chit-Chat-Toe!');
    sock.on('turn', function (turn) {
        console.log(turn);
    });
    sock.on('msg', function (txt) {
        io.emit('msg', txt);
        console.log('Server: Broadcasting: ' + txt);
    });
    
    if (waitingPlayer) {//Enough Players: Start Match
        matchStart(waitingPlayer, sock);
        waitingPlayer = null;
    } else {//no waiting player
        waitingPlayer = sock;
        sock.emit('msg', 'You are waiting for a second player!');
    }
    
    sock.on('disconnect', onDisconnect);
   
}
function onDisconnect(sock){
    console.log('Socket Client disconnected!');
    
}
function matchStart(sock1, sock2) {
    sock2.emit('msg', 'Match Starts Now!');
}
