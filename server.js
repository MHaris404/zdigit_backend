const express = require("express")
const app = express()
const cors = require('cors');
var morgan = require('morgan')

const logger = require('node-color-log');
const connection = require('./config/dbconnection')

app.use(express.json())
app.use(cors({origin: true, credentials: true}))

app.use(morgan('production'));

require('./app/routes.js')(app, connection); // load our routes

const port = process.env.PORT
//app.listen(port, ()=> logger.success(`Server Started on port ${port} on ` + new Date()))

// app.listen(process.env.PORT || 5000, function(){
//     console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
//   });



app.listen(process.env.PORT || 5000, function(){
    console.log("hellow Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });

  app.timeout = 60 * 60 * 60 * 1000;