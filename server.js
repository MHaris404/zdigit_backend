const express = require("express")
const app = express()
const cors = require('cors');
var morgan = require('morgan')
var timeout = require('connect-timeout')
require ('newrelic');

const logger = require('node-color-log');
const connection = require('./config/dbconnection')

app.use(express.json())
// app.use(cors({origin: true, credentials: true}))
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.use(cors())
app.use(morgan('production'));
app.use(timeout('29s'))

require('./app/routes.js')(app, connection); // load our routes

app.listen(process.env.PORT || 5000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
