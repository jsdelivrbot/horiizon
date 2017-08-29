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
app.use(express.static(__dirname + '/public_html'
                      ));

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
var whiteTeam =[];
var blackTeam =[];

var peiceName = [
    "EMPTY",//i[0]
    "W-Rook 1", "W-Knight 1", "W-Bishop 1", "W-Queen",//[1-4]
    "W-King", "W-Bishop 2", "W-Knight 2", "W-Rook 2",//[5-8]
    "W-Pawn 1","W-Pawn 2","W-Pawn 3","W-Pawn 4",//[9-12]
    "W-Pawn 5","W-Pawn 6","W-Pawn 7","W-Pawn 8",//[13-16]
    "B-Rook 1", "B-Knight 1", "B-Bishop 1", "B-Queen",//[1-4]
    "B-King", "B-Bishop 2", "B-Knight 2", "B-Rook 2",//[5-8]
    "B-Pawn 1","B-Pawn 2","B-Pawn 3","B-Pawn 4",//[9-12]
    "B-Pawn 5","B-Pawn 6","B-Pawn 7","B-Pawn 8"//[13-16]
];

function Peice(num, pos) { //OBJECT PROTOTYPE
    this.name = peiceName[num];
    this.num = num;
    this.team = team;
    this.type = ""; //O-L-X-H-P  Moving Patterns
    this.pos = pos;
};


function initBoard() {
    for(var i=)
}



function loadTeam(){
    var col = "a"; //Column Letter Position
    for(var i=1;i<9;i++){//create PAWNS
        var w = new Peice('W-', 1,(col + 2));
        var b = new Peice('B-', 11,(col + 7)); 
        console.log('col is: ' + col);
        incrChar(col);
        console.log('col after: '+col);
    };
};


function incrChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1)
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
    


