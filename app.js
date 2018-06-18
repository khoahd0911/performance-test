var express = require('express');
var bodyparser = require('body-parser');

var app = express();
app.use('/', express.static(__dirname + '/server/*'));
app.use('/', express.static(__dirname + '/public'));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

var server = app.listen(3000, function() {
  console.log('Server listening on port ' + server.address().port);
});