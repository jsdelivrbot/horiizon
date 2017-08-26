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

var SOCKET_LIST = {};
var PLAYER_LIST = {};
var GAME = {};

io.sockets.on('connection', (socket) =>{
    onConnect(socket);
    onDisconnect(socket);
});
io.on('disconnect', onDisconnect);

//=============ROUTES================
app.get('/about', function (req, res) {
    res.send('hello');
});
app.get('/chess', function (req, res) {
    res.render('chess', {data: data});
    data.counter++;
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

function onConnect(socket){
    console.log('New Connection Socket');
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    
    
    socket.x1 = 0;
    socket.x2 = 0;
    socket.y1 = 0;
    socket.y2 = 0;
    
    setBoard();
};

var peices = {
    1:"W Pawn",
    2:"W Rook1",
    3:"W Knight1",
    4:"W Bishop1",
    5:"W Queen",
    6:"W King",
    7:"W Bishop2",
    8:"W Knight2",
    9:"W Rook2",

    11:"B Pawn",
    12:"B Rook1",
    13:"B Knight1",
    14:"B Bishop1",
    15:"B Queen",
    16:"B King",
    17:"B Bishop2",
    18:"B Knight2",
    19:"B Rook2"
};


function NewGame() {
    var a = [];
    
    //INIT ARRAY
    for(var i = 0; i<120;i++){
        a[i]=0;
    };
    
    //Peices
    for(var k=1;k<9;k++){
        a[k+20] = k+1; //white
        a[k+90] = k+10;//Black
    };
    
    //Load Pawns
    for(var j=1;j<9;j++){
        a[j+30]= j;//white 1-9
        a[j+50]= j+11;//black
    };
    


};

function updater(data){
    var pack = data;    
    io.emit('update', pack);
    console.log('Data Pack Sent!');
};
function setBoard(){
    var pack = [];
    var board = new NewGame();
    console.log('Board was set!');
    updater(board);
};

function onDisconnect(socket) {
    delete SOCKET_LIST[socket.id];
    console.log('Player Disconnected, Players left:  ' + SOCKET_LIST.length);
};
    


