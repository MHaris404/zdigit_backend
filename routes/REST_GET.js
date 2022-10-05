
var connection = require('../config/dbconnection');

exports.getPOCOUNT = function (req, res) {

	connection.getConnection ( async (err, connection)=> {
		if (err) throw (err)
		const sqlSearch = "Select count(order_no) as count from 0_purch_orders"
		await connection.query (sqlSearch, async (err, result) => {
			connection.release();
			if (err) throw (err)
			if (result.length == 0) {
				res.json({
					status : false,
					message : "No PO to be processed",
					details : result[0].count
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
		// const sqlSearch = "Select POD.*, PO.supplier_id, SS.supp_name from 0_purch_order_details as POD, 0_suppliers as SS, 0_purch_orders as PO "
		// + "where POD.order_no=PO.order_no and PO.supplier_id=SS.supplier_id"
		const sqlSearch = "Select 0_purch_order_details.*, 0_purch_orders.supplier_id, 0_purch_orders.comments,0_purch_orders.ord_date,0_purch_orders.reference,0_purch_orders.requisition_no,0_purch_orders.into_stock_location,0_purch_orders.delivery_address,0_suppliers.supp_name from 0_purch_order_details, 0_suppliers, 0_purch_orders where 0_purch_order_details.order_no=0_purch_orders.order_no and 0_purch_orders.supplier_id=0_suppliers.supplier_id"
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
					message : "PO list fetched ",
					details : result
				})
			}//end
		}) //end of connection.query()
	}) //end of db.connection()

};
