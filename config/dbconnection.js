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
  	stream: sockConn
});
dbConnection.query('SELECT 1+1 as test1;', function(err, rows, fields) {
  if (err) throw err;

  console.log('Result: ', rows);
  sockConn.dispose();
});
// dbConnection.end();

// 
//
// var url = require("url");
// var remote_options = {
//   host:'ec2-3-238-24-27.compute-1.amazonaws.com',
//   port: 3306
// };
// var proxy = url.parse("socks5://n16vhxv8n4lbst:x8nrhq8r8d3zr2ghfxetp9m8vg6@us-east-static-07.quotaguard.com:1080");
// var auth = proxy.auth;
// var username = auth.split(":")[0]
// var pass = auth.split(":")[1]

// var sock_options = {
//   host: proxy.hostname,
//   port: 1080,
//   user: username,
//   pass: pass
// }
// var sockConn = new SocksConnection(remote_options, sock_options)
// var dbConnection = mysql.createConnection({
// 		host: 'sodabaz.com',
// 		port: 3306,
//       user: 'sodabaz_ebox_2',
//       password: 'sodabaz_ebox_2',
//       database: 'sodabaz_ebox_erp',
//       connectTimeout : 60 * 60 * 1000,
//       acquireTimeout : 60 * 60 * 1000,
//       multipleStatements: true,
//       waitForConnections: true,
//       connectionLimit: 100,
//   stream: sockConn
// });
// dbConnection.query('SELECT 1+1 as test1;', function(err, rows, fields) {
// 	if (err) throw err;
  
// 	console.log('Result: ', rows);
// 	sockConn.dispose();
//   });
//   dbConnection.end();
// 
//


const dbconfig = require('./database')
const logger = require('node-color-log');

var con;

function handleDisconnect() {
	
	con = mysql.createPool(
		dbconfig
		); 	// Recreate the connection

	con.getConnection((succes, err) =>{
		if(succes) {
		
			logger.success('DBb Connection established @ ' + new Date());
		}
		
	})

	con.on('error', function (err) { 
		if(err.code === 'PROTOCOL_CONNECTION_LOST') {
			logger.warn('DB type 1:', err + ' @ ' + new Date());

		}else if(err.code === 'PROTOCOL_PACKETS_OUT_OF_ORDER'){
			logger.error('DB type 2:', err + ' @ ' + new Date());

		}else if(err.code === 'PROTOCOL_SEQUENCE_TIMEOUT'){
			logger.error('DB type 3:', err + ' @ ' + new Date());

		}else if(err.code === 'ETIMEDOUT'){
			logger.error('DB type 4:', err + ' @ ' + new Date());

		}else {
			logger.error('DB type else:', err + ' @ ' + new Date());
			
		}
	 })

	con.on('acquire', function (connection) {
		logger.debug(`Connection ${connection.threadId} acquired`);
	});

	con.on('connection', function (connection) {
		connection.query('SET SESSION auto_increment_increment=1')
	});

	con.on('enqueue', function () {
		logger.debug('Waiting for available connection slot');
	});

	con.on('release', function (connection) {
		logger.info(`Connection ${connection.threadId} released`);
	});

}

//handleDisconnect();

module.exports = dbConnection;
