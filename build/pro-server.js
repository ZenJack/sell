var express = require('express');

var app = express();

var appData = require('../data.json');
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

var apiRoutes = express.Router();

// apiRoutes.all('/*', function (req, res, next) {
//   console.log('req:' + JSON.stringify(req.headers));
//   var origin = req.get('origin');
//   console.log(origin);
//   res.set('Access-Control-Allow-Origin', '*');
//   next();
// });

apiRoutes.get('/seller', function (req, res) {
  res.json({
    errno: 0,
    data: seller
  });
});

apiRoutes.get('/goods', function (req, res) {
  res.json({
    errno: 0,
    data: goods
  });
});

apiRoutes.get('/ratings', function (req, res) {
  res.json({
    errno: 0,
    data: ratings
  });
});

apiRoutes.post('/test', function (req, res) {
  console.log('body:' + JSON.stringify(req.body));
  res.json(req.body);
});

app.use('/api', apiRoutes);

var port = 8088;
app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
});
console.log('正在监听' + port + '端口……');
