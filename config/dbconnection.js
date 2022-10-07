var mysql = require('mysql2');

// const sockConn = require('socks').SocksClient;

var url = require("url");
var SocksConnection = require('socksjs');
var remote_options = {
  host:'sodabaz.com',
  port: 3306
};

// var proxy = url.parse("socks5://n16vhxv8n4lbst:x8nrhq8r8d3zr2ghfxetp9m8vg6@us-east-static-07.quotaguard.com:1080");
// var auth = proxy.auth;
// var username = auth.split(":")[0]
// var pass = auth.split(":")[1]

var sock_options = {
  host: "us-east-static-07.quotaguard.com",
  port: 1080,
  user: "n16vhxv8n4lbst",
  pass: "x8nrhq8r8d3zr2ghfxetp9m8vg6"
}
var sockConn = new SocksConnection(remote_options, sock_options)
var dbConnection = mysql.createPool({
	user: 'sodabaz_ebox_2',
      password: 'sodabaz_ebox_2',
      database: 'sodabaz_ebox_erp',

  	stream: sockConn,

});

dbConnection.getConnection(function(err, connection){

	if(err) throw err;

	querySQL = "SELECT * FROM 0_users";

	connection.promise().query(querySQL).then(([rows,fields])=> {

	if (rows!=undefined) {
		console.log("The table already exist");
		console.log(rows)
		
	}else {

		querySQL = "SELECT * FROM 0_users where user_id = 1";

		connection.query(querySQL,function(err,rows,field){

		if(err) throw err;

		console.log("The table has been created");
		console.log(rows);

		});

	}

	})
	.catch(console.log)
	
});

// sockConn.dispose();
// dbConnection.end();

// dbConnection.getConnection(function(err, connection){

// 	if(err) throw err;

// 	querySQL = "SELECT * FROM 0_users";

// 	connection.promise().query(querySQL).then(([rows,fields])=> {

// 	  if (rows!=undefined) {
// 		console.log("The table already exist");
// 		console.log(rows)
// 	  }else {

// 		querySQL = "SELECT * FROM 0_users where user_id = 1";

// 		connection.query(querySQL,function(err,rows,field){

// 		  if(err) throw err;

// 		  console.log("The table has been created");
// 		  console.log(rows);

// 		});

// 	  }

// 	})
// 	.catch(console.log)
// 	.then( ()=> {

// 	  querySQL = "SELECT * FROM 0_users where user_id = 2";

// 	  connection.promise().query(querySQL).then(([rows,fields])=> {

// 		/*
// 		More stuff
// 		*/

// 	  })
// 	  .catch(console.log)
// 	  .then( ()=> console.log("Promise ended") );

// 	});

//   });


const dbconfig = require('./database')
const logger = require('node-color-log');

var con;

function handleDisconnect() {
	
	// con = mysql.createPool(
	// 	dbconfig
	// 	); 	// Recreate the connection

	// dbConnection.getConnection((succes, err) =>{
	// 	if(succes) {
		
	// 		logger.success('DBb Connection established @ ' + new Date());
	// 	}
		
	// })

	dbConnection.on('error', function (err) { 
		if(err.code === 'PROTOCOL_CONNECTION_LOST') {
			logger.warn('DB type 1:', err + ' @ ' + new Date());

		}else if(err.code === 'PROTOCOL_PACKETS_OUT_OF_ORDER'){
			logger.error('DB type 2:' + err + ' @ ' + new Date());

		}else if(err.code === 'PROTOCOL_SEQUENCE_TIMEOUT'){
			logger.error('DB type 3:' + err + ' @ ' + new Date());

		}else if(err.code === 'ETIMEDOUT'){
			logger.error('DB type 4:'+ err + ' @ ' + new Date());

		}else {
			logger.error('DB type else:' + err + ' @ ' + new Date());
			
		}
	 })

	 dbConnection.on('acquire', function (connection) {
		logger.debug(`Connection ${connection.threadId} acquired`);
	});

	dbConnection.on('connection', function (connection) {
		connection.query('SET SESSION auto_increment_increment=1')
	});

	dbConnection.on('enqueue', function () {
		logger.debug('Waiting for available connection slot');
	});

	dbConnection.on('release', function (connection) {
		logger.info(`Connection ${connection.threadId} released`);
	});

}

// handleDisconnect();

module.exports = dbConnection;
