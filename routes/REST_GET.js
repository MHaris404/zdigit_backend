
var connection = require('../config/dbconnection');

exports.getPOCOUNT = function (req, res) {

		//const sqlSearch0  = "SELECT concat_ws('', pomaster.id, '') `order_no`, concat_ws('', detail.id, '') `po_detail_item`,items.item_code, grn.description,concat_ws('', detail.required_del_date, '') `delivery_date`,concat_ws('', detail.price_before_tax, '') `unit_price`, concat_ws('', detail.qty, '') `quantity_ordered`,grn.qty_recd as quantity_received, concat_ws('', pomaster.supplier_id, '') `supplier_id`,concat_ws('', DATE_FORMAT(pomaster.order_date, '%Y/%c/%d'), '') `ord_date`, concat_ws('', pomaster.order_reference, '') `reference`, concat_ws('', pomaster.delivered_to, '') `delivery_address`, pomaster.approval_1,pomaster.approval_2, pomaster.rejection_reason_1,pomaster.rejection_reason_2 , pomaster.created_by, concat_ws('', vendor.name, '') `supp_name` from `0_vendor_master` vendor ,`0_po_master` pomaster, `0_user_auth_matrix_for_po` pomatrix, `0_items` items right join `0_po_detail` detail  on detail.item_id = items.id left join `0_grn_items` grn on detail.id = grn.po_detail_item where pomaster.id = detail.po_id and pomaster.supplier_id = vendor.id group by detail.id"
		
		const sqlSearch0 = "SELECT concat_ws('', pomaster.id, '') `order_no`, concat_ws('', detail.id, '') `po_detail_item`, ifnull(items.item_code, cat.service_code) as item_code, ifnull(items.item_name, cat.category) as item_name, ifnull(grn.description, 'GRN not made yet') as grn_description, concat_ws('', detail.required_del_date, '') `delivery_date`, concat_ws('', detail.price_before_tax, '') `unit_price`, concat_ws('', detail.qty, '') `quantity_ordered`, grn.qty_recd as quantity_received, concat_ws('', pomaster.supplier_id, '') `supplier_id`, concat_ws('', DATE_FORMAT(pomaster.order_date, '%Y/%c/%d'), '') `ord_date`, concat_ws('', pomaster.order_reference, '') `reference`, concat_ws('', pomaster.delivered_to, '') `delivery_address`, pomaster.approval_1, pomaster.approval_2, pomaster.rejection_reason_1, pomaster.rejection_reason_2, pomaster.created_by, concat_ws('', vendor.name, '') `supp_name`, cost.cost_center, country.country, country.currency, profit.profit_center, concat_ws(' - ', budget.budget_code, budget.budget_description) `budget_code`, concat_ws(' - ', subbudget.sub_budgtet_code, subbudget.budget_description) `sub_budget_code` from `0_vendor_master` vendor ,`0_po_master` pomaster, `0_user_auth_matrix_for_po` pomatrix, `0_category` cat, `0_cost_center` cost, `0_location_profit_center` profit,`0_country` country, `0_budget_master` budget , `0_sub_budget` subbudget ,`0_items` items right join `0_po_detail` detail on detail.item_id = items.id left join `0_grn_items` grn on detail.id = grn.po_detail_item where pomaster.id = detail.po_id and pomaster.supplier_id = vendor.id and pomaster.country_id = country.id and pomaster.cost_center_id = cost.id and pomaster.profit_center_id = profit.id and pomaster.budget_id = budget.id and pomaster.sub_budget_id = subbudget.id group by detail.id"
		const sqlSearch = "SELECT count(*) as count from (" + sqlSearch0 + ") as count ";

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
							details : result[0].count
							})
					} else {
						console.log(result[0])
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

		//const sqlSearch  = "SELECT concat_ws('', pomaster.id, '') `order_no`, concat_ws('', detail.id, '') `po_detail_item`, ifnull(items.item_code, cat.service_code) as item_code, ifnull(grn.description, 'query static desc') as description, concat_ws('', detail.required_del_date, '') `delivery_date`,concat_ws('', detail.price_before_tax, '') `unit_price`,concat_ws('', detail.qty, '') `quantity_ordered`,grn.qty_recd as quantity_received,	concat_ws('', pomaster.supplier_id, '') `supplier_id`,	concat_ws('', DATE_FORMAT(pomaster.order_date, '%Y/%c/%d'), '') `ord_date`,	concat_ws('', pomaster.order_reference, '') `reference`,	concat_ws('', pomaster.delivered_to, '') `delivery_address`,pomaster.approval_1,pomaster.approval_2,pomaster.rejection_reason_1,pomaster.rejection_reason_2,pomaster.created_by, concat_ws('', vendor.name, '') `supp_name` from `0_vendor_master` vendor ,`0_po_master` pomaster, `0_user_auth_matrix_for_po` pomatrix, `0_category` cat,`0_items` items right join `0_po_detail` detail  on detail.item_id = items.id	left join `0_grn_items` grn on detail.id = grn.po_detail_item where pomaster.id = detail.po_id and pomaster.supplier_id = vendor.id	group by detail.id"
		const sqlSearch = "SELECT CONCAT_WS('', @selected := 0, '') `selected`, concat_ws('', pomaster.id, '') `order_no`, concat_ws('', detail.id, '') `po_detail_item`, ifnull(items.item_code, cat.service_code) as item_code, ifnull(items.item_name, cat.category) as item_name, ifnull(grn.description, 'GRN not made yet') as grn_description, concat_ws('', detail.required_del_date, '') `delivery_date`, concat_ws('', detail.price_before_tax, '') `unit_price`, concat_ws('', detail.qty, '') `quantity_ordered`, grn.qty_recd as quantity_received, concat_ws('', pomaster.supplier_id, '') `supplier_id`, concat_ws('', DATE_FORMAT(pomaster.order_date, '%Y/%c/%d'), '') `ord_date`, concat_ws('', pomaster.order_reference, '') `reference`, concat_ws('', pomaster.delivered_to, '') `delivery_address`, pomaster.approval_1, pomaster.approval_2, pomaster.rejection_reason_1, pomaster.rejection_reason_2, pomaster.created_by, concat_ws('', vendor.name, '') `supp_name`, cost.cost_center, country.country, country.currency, profit.profit_center, concat_ws(' - ', budget.budget_code, budget.budget_description) `budget_code`, concat_ws(' - ', subbudget.sub_budgtet_code, subbudget.budget_description) `sub_budget_code` from `0_vendor_master` vendor ,`0_po_master` pomaster, `0_user_auth_matrix_for_po` pomatrix, `0_category` cat, `0_cost_center` cost, `0_location_profit_center` profit,`0_country` country, `0_budget_master` budget , `0_sub_budget` subbudget ,`0_items` items right join `0_po_detail` detail on detail.item_id = items.id left join `0_grn_items` grn on detail.id = grn.po_detail_item where pomaster.id = detail.po_id and pomaster.supplier_id = vendor.id and pomaster.country_id = country.id and pomaster.cost_center_id = cost.id and pomaster.profit_center_id = profit.id and pomaster.budget_id = budget.id and pomaster.sub_budget_id = subbudget.id group by detail.id"

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
