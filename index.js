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

var server = http.createServer(app);
var io = socket(server);
var waitingPlayer;
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/about.html', function (req, res) {
    res.send('hello');
});

server.get('/', function (request, response) {
    response.send('Whats up? from horiizon World');
    console.log('General Get Called');
});

io.on('connection', onConnect);

io.on('disconnect', onDisconnect);



server.listen(PORT, function () {
    console.log('Server listening: ' + PORT);
});

//============================
/*
const stitch = require("mongodb-stitch")
const client = new stitch.StitchClient('horiizonapp-kjfmu');
const db = client.service('mongodb', 'mongodb-atlas').db('HoriizonDB');
client.login().then(() =>
  db.collection('users.horiizonCollection').updateOne({owner_id: client.authedId()}, {$set:{number:42}}, {upsert:true})
).then(() =>
  db.collection('users.horiizonCollection').find({owner_id: client.authedId()})
).then(docs => {
  console.log("Found docs", docs)
  console.log("[MongoDB Stitch] Connected to Stitch")
}).catch(err => {
  console.error(err)
});
*/
//=============================


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
function onDisconnect(sock) {
    console.log('Socket Client disconnected!');
    
}
function matchStart(sock1, sock2) {
    sock2.emit('msg', 'Match Starts Now!');
}
