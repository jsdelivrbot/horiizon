var express = require('express');
var socket = require('socket.io');
var http = require('http');
var events = require('events');
var mongo = require('mongodb');
var assert = require('assert');

var app = express();
var PORT = process.env.PORT || 8080;

var data = {counter: 1};

app.set('port', PORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public_html'));

//===============MONGO================
app.get('/list', function (req, res) {
    var dbClient = mongodb.MongoClient;
    var url = 'mongodb://localhost:27017/horiizon';
    mongo.connect(url, function(err, db) {
        if(err){
            console.log('Unable to connect', err)
        } else if(collection.find({})) {
            console.log('Connection to db');
            var coll = db.collection('users');
            coll.find({});
        } else {
            res.send('No Documents found');
        }
        db.close();
        
    });
});
//===========SOCKETS===============
var server = http.createServer(app);
var io = socket(server);
var waitingPlayer;

io.on('connection', onConnect);
io.on('disconnect', onDisconnect);

//=============ROUTES================
app.get('/about', function (req, res) {
    res.send('hello');
});

app.get('/', function(req, res) {
    res.render('index', {data: data});
    data.counter++;
    
    console.log('get / called: render index');
});

server.listen(PORT, function () {
    console.log('Server listening: ' + PORT);
});


//=============FUNCTIONS================


function onConnect(sock) {  
    console.log('Socket Client Connected!');
    
    sock.emit('msg', 'Welcome to Chit-Chat-Toe!');
    
    sock.on('msg', function (txt) {
        io.emit('msg', txt);
        console.log('Server: Broadcasting: ' + txt);
    });
    
    if (waitingPlayer) {//Enough Players: Start Match
        matchStart(waitingPlayer, sock);
        waitingPlayer = null;
    }else {//no waiting player
        waitingPlayer = sock;
        sock.emit('msg', 'You are waiting for a second player!');
    }
    sock.on('disconnect', onDisconnect);
}

function onDisconnect(sock) {
    console.log('Socket Client disconnected!');
    
}
function matchStart(sock1, sock2) {
    sock2.emit('msg', 'Match Starts Now!');
}


