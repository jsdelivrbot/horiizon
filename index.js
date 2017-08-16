var express = require('express');
var socket = require('socket.io');
var http = require('http');
var events = require('events');
var mongo = require('mongodb').MongoClient;
var assert = require('assert');

var app = express();
var PORT = process.env.PORT || 8080;



app.set('port', (PORT));
app.use(express.static(__dirname + '/public_html'));

//============================

mongoose.connect('mongodb://localhost:8080/users', {
    useMongoClient: true
});

mongoose.model('users', {name: String});
mongoose.model('posts', {content: String});

app.get('/users', function (req, res) {
    mongoose.model('users').find(function (err, users) {
        res.send(users);
        console.log('Get req: users');
    });
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
//=============================

var server = http.createServer(app);
var io = socket(server);
var waitingPlayer;
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/about.html', function (req, res) {
    res.send('hello');
});

app.get('/', function (request, response) {
    response.send('Whats up? from horiizon World');
    console.log('General Get Called');
});



io.on('connection', onConnect);

io.on('disconnect', onDisconnect);



//server.listen(PORT, function () {
 //   console.log('Server listening: ' + PORT);
//});





function onConnect(sock) {  
    sock.emit('msg', 'Welcome to Chit-Chat-Toe!');
    sock.on('turn', function(turn) {
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
