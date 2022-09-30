
var connection = require('../config/dbconnection');

exports.getPOCOUNT = function (req, res) {

	connection.getConnection ( async (err, connection)=> {
		if (err) throw (err)
		const sqlSearch = "Select count(order_no) as count from 0_purch_order"
		await connection.query (sqlSearch, async (err, result) => {
			connection.release();
			if (err) throw (err)
			if (result.length == 0) {
				res.status(200).json({
					status : false,
					message : "No PO to be processed"
					})
			} else {
				res.status(200).json({
					status : true,
					message : "PO found",
					details : result[0].count
				})
			}//end
		}) //end of connection.query()
	}) //end of db.connection()

};

exports.getPODETAILS = function (req, res) {

	connection.getConnection ( async (err, connection)=> {
		if (err) throw (err)
		const sqlSearch = "Select POD.*, PO.supplier_id, SS.supp_name from 0_purch_order_details as POD, 0_suppliers as SS, 0_purch_orders as PO "
		+ "where POD.order_no=PO.order_no and PO.supplier_id=SS.supplier_id"
		await connection.query (sqlSearch, async (err, result) => {
			connection.release();
			if (err) throw (err)
			if (result.length == 0) {
				res.status(200).json({
					status : false,
					message : "No PO to be processed"
					})
			} else {
				res.status(200).json({
					status : true,
					message : "PO found",
					details : result
				})
			}//end
		}) //end of connection.query()
	}) //end of db.connection()

};
