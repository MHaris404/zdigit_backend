const express = require("express")
const app = express()
const cors = require('cors');
var morgan = require('morgan')
// var timeout = require('connect-timeout')

const logger = require('node-color-log');
const connection = require('./config/dbconnection')

app.use(express.json())
app.use(cors())
app.use(morgan('production'));
// app.use(timeout('29s'))

require('./app/routes.js')(app, connection); // load our routes

//live server
// app.listen(process.env.PORT || 5000, function(){
//     console.log("Express server listening on port %d in %s mode " + new Date(), this.address().port, app.settings.env);
//   });

//localhost
app.listen(5000, function(){
  console.log("Express server listening on port %d in %s mode " + new Date(), this.address().port, app.settings.env);
});
