<<<<<<< HEAD
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 8080));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.send('Whats up? from horiizon World');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
=======
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 8080));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.send('Hi World');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
>>>>>>> fd9fe279fa95602077dee01bbe6f66a28c996443
