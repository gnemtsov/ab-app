const express = require('express');
const app = express();

app.use(express.static('public'));

app.use(function(req, res, next) {
  req.url = 'app.html';
  next();
});

app.use(express.static('public'));

app.listen(80, () => console.log('Listening..'))