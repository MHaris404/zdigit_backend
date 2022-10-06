var mysql = require('mysql');

const dbconfig = require('./database')
const logger = require('node-color-log');

var con;

function handleDisconnect() {
	
	con = mysql.createPool(
		dbconfig
		); 	// Recreate the connection

	con.getConnection((succes, err) =>{
		if(succes) {
		
			logger.success('DB Connection established @ ' + new Date());
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

handleDisconnect();

module.exports = con;
