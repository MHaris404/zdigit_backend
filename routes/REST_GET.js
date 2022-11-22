
var connection = require('../config/dbconnection');

exports.getPOCOUNT = function (req, res) {

		//const sqlSearch = "Select count(order_no) as count from 0_purch_orders"
		const sqlSearch0  = "SELECT concat_ws('', pomaster.id, '') `order_no`, concat_ws('', detail.id, '') `po_detail_item`,items.item_code, grn.description,concat_ws('', detail.required_del_date, '') `delivery_date`,concat_ws('', detail.price_before_tax, '') `unit_price`, concat_ws('', detail.qty, '') `quantity_ordered`,grn.qty_recd as quantity_received, concat_ws('', pomaster.supplier_id, '') `supplier_id`,concat_ws('', DATE_FORMAT(pomaster.order_date, '%Y/%c/%d %H:%i'), '') `ord_date`, concat_ws('', pomaster.order_reference, '') `reference`, concat_ws('', pomaster.delivered_to, '') `delivery_address`, pomaster.approval_1,pomaster.approval_2, pomaster.rejection_reason_1,pomaster.rejection_reason_2, concat_ws('', vendor.name, '') `supp_name` from `0_vendor_master` vendor ,`0_po_master` pomaster, `0_user_auth_matrix_for_po` pomatrix, `0_items` items right join `0_po_detail` detail  on detail.item_id = items.id left join `0_grn_items` grn on detail.id = grn.po_detail_item where pomaster.id = detail.po_id and pomaster.supplier_id = vendor.id group by detail.id"
		const sqlSearch = "SELECT count(*) from (" + sqlSearch0 + ")  as count ";

		connection.getConnection((err, conn) => {
			if(err) 
			{
				console.log("getPOCount: " + err + " " + new Date())
			} else {
				conn.query (sqlSearch, (err, result, fields) => {
					
					conn.release()

					if ( result == null || result.length <= 0) {
						res.json({
							status : false,
							message : "No PO to be processed",
							details : result[0]
							})
					} else {
						console.log(result[0])
						res.status(200).json({
							status : true,
							message : "PO found",
							details : result[0]
						})
					}//end

				}) //end of connection.query()
			}
		})

};

exports.getPODETAILS = function (req, res) {

		//const sqlSearch ="Select 0_purch_order_details.order_no, 0_purch_order_details.po_detail_item, 0_purch_order_details.item_code, 0_purch_order_details.description, DATE_FORMAT(0_purch_order_details.delivery_date, '%Y/%c/%d %H:%i') as delivery_date, 0_purch_order_details.qty_invoiced, 0_purch_order_details.unit_price, 0_purch_order_details.unit_price, 0_purch_order_details.act_price, 0_purch_order_details.std_cost_unit, 0_purch_order_details.quantity_ordered, 0_purch_order_details.quantity_received, 0_purch_orders.supplier_id, 0_purch_orders.comments, DATE_FORMAT(0_purch_orders.ord_date, '%Y/%c/%d %H:%i') as ord_date, 0_purch_orders.reference, 0_purch_orders.requisition_no, 0_purch_orders.into_stock_location, 0_purch_orders.delivery_address, 0_suppliers.supp_name from 0_purch_order_details, 0_suppliers, 0_purch_orders where 0_purch_order_details.order_no=0_purch_orders.order_no and 0_purch_orders.supplier_id=0_suppliers.supplier_id"
		
		const sqlSearch  = "SELECT concat_ws('', pomaster.id, '') `order_no`, concat_ws('', detail.id, '') `po_detail_item`,items.item_code, grn.description,concat_ws('', detail.required_del_date, '') `delivery_date`,concat_ws('', detail.price_before_tax, '') `unit_price`, concat_ws('', detail.qty, '') `quantity_ordered`,grn.qty_recd as quantity_received, concat_ws('', pomaster.supplier_id, '') `supplier_id`,concat_ws('', DATE_FORMAT(pomaster.order_date, '%Y/%c/%d %H:%i'), '') `ord_date`, concat_ws('', pomaster.order_reference, '') `reference`, concat_ws('', pomaster.delivered_to, '') `delivery_address`, pomaster.approval_1,pomaster.approval_2, pomaster.rejection_reason_1,pomaster.rejection_reason_2, concat_ws('', vendor.name, '') `supp_name` from `0_vendor_master` vendor ,`0_po_master` pomaster, `0_user_auth_matrix_for_po` pomatrix, `0_items` items right join `0_po_detail` detail  on detail.item_id = items.id left join `0_grn_items` grn on detail.id = grn.po_detail_item where pomaster.id = detail.po_id and pomaster.supplier_id = vendor.id group by detail.id"

		connection.getConnection((err, conn) => {
			if(err) 
			{
				console.log("getPODetails: " + err+ " " + new Date())
				
			} else {
				conn.query (sqlSearch, (err, result, fields)  => {
					
					conn.release()
					if ( result == null || result.length <= 0) {
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
