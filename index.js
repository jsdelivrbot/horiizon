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
/*
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
*/
//===========SOCKETS===============
var server = http.createServer(app);
var io = socket(server);
var waitingPlayer;
var SOCKET_LIST = [];

io.on('connection', onConnect);
io.on('disconnect', onDisconnect);

io.sockets.on('connection', (socket) =>{

    
});
setInterval(function(){
    
});

//=============ROUTES================
app.get('/about', function (req, res) {
    res.send('hello');
});
app.get('/chess', function (req, res) {
    res.render('chess', {data: data});
    console.log('App.get called for Chess')
})

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
    console.log('OnConnect: Socket connected');
    sock.emit('msg', 'Welcome');
    
    sock.on('msg', function (txt) {
        io.emit('msg', txt);
        console.log('Server: Broadcasting: ' + txt);
    });
    
    
    sock.id = Math.random();
    sock.x = 0;
    sock.y = 0;
    
    SOCKET_LIST.push(sock);
    console.log('Players Array Length: ' + SOCKET_LIST.length);
    sock.on('disconnect', onDisconnect);
};

function onDisconnect(sock) {
    SOCKET_LIST.pop(sock);
    console.log('Player Disconnected, Players left:  ' + SOCKET_LIST.length);
};
    


