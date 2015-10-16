var express = require('express');
var app = express();

app.use(express.static('public'));
app.get('/', function(req, res){
  res.redirect('games/');
});

app.listen(process.env.PORT || 9999);