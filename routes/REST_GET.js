
var connection = require('../config/dbconnection');

exports.getPOCOUNT = function (req, res) {

		const sqlSearch = "Select count(order_no) as count from 0_purch_orders"

		connection.getConnection((err, conn) => {
			if(err) 
			{
				console.log("getPOCount: " + err + " " + new Date())
			} else {
				conn.query (sqlSearch, (err, result, fields) => {
					
					conn.release()

					if (result == 0) {
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
			}
		})

};

exports.getPODETAILS = function (req, res) {

		const sqlSearch ="Select 0_purch_order_details.order_no, 0_purch_order_details.po_detail_item, 0_purch_order_details.item_code, 0_purch_order_details.description, DATE_FORMAT(0_purch_order_details.delivery_date, '%Y/%c/%d %H:%i') as delivery_date, 0_purch_order_details.qty_invoiced, 0_purch_order_details.unit_price, 0_purch_order_details.unit_price, 0_purch_order_details.act_price, 0_purch_order_details.std_cost_unit, 0_purch_order_details.quantity_ordered, 0_purch_order_details.quantity_received, 0_purch_orders.supplier_id, 0_purch_orders.comments, DATE_FORMAT(0_purch_orders.ord_date, '%Y/%c/%d %H:%i') as ord_date, 0_purch_orders.reference, 0_purch_orders.requisition_no, 0_purch_orders.into_stock_location, 0_purch_orders.delivery_address, 0_suppliers.supp_name from 0_purch_order_details, 0_suppliers, 0_purch_orders where 0_purch_order_details.order_no=0_purch_orders.order_no and 0_purch_orders.supplier_id=0_suppliers.supplier_id"
		
		connection.getConnection((err, conn) => {
			if(err) 
			{
				console.log("getPODetails: " + err+ " " + new Date())
				
			} else {
				conn.query (sqlSearch, (err, result, fields)  => {
					
					conn.release()
					if (result == 0) {
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
			}
		})

};
