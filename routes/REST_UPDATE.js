var connection = require('../config/dbconnection');

app.update("/poapproval_l1", (req, res)=> {
	const {userid,po} = req.body;

	const sqlSearch = "update `0_po_master` pomaster ,`0_user_auth_matrix_for_po` pomatrix set pomaster.approval_1 = 'approved' where pomaster.created_by = pomatrix.user_id and pomaster.approval_1 is null and pomaster.rejection_reason_1 is null and pomaster.id = ? and pomatrix.approver_level_1 = ?"
	const search_query = mysql.format(sqlSearch,[po, userid])

	 connection.getConnection( (err, conn) => {
			if(err) 
			{
				console.log("poapproval: " + err + " " + new Date())
			}
			conn.query (search_query,  (err, result, fields) => {
				conn.release()
				if (err) throw err;

				if ( result == null || result.length <= 0) {
					res.json({ //put status
						status : false,
						message : "failed for a reason"
						})
				} else {
					console.log("sucess")
					res.status(200).json({
						status : true,
						message : `Approved Level 1 PO # ${po}
					})
					
				}//end
		}) //end of connection.query()
		
	})
		 
}) //end of app.post()


