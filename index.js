
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors());

mongoose = require('mongoose'),
    Warehouse = require('./api/models/warehouseModel'),
    Warehouse = require('./api/models/itemModel'),
    bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://tvhUser:azertyuiop5@ds113938.mlab.com:13938/tvh', { useNewUrlParser: true, useFindAndModify: false });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/warehouseRoutes'); //importing route
routes(app); //register the route

app.listen(port);

console.log('API server started on: ' + port);