var connection = require('../config/dbconnection');
const mysql = require("mysql2")

exports.updatePOapproval = function (req, res) {
    const { userid, po } = req.body;

    const sqlSearch0 = "select pomaster.id ,pomaster.approval_1, pomaster.approval_2, pomaster.rejection_reason_1 ,pomaster.rejection_reason_2 from `0_po_master` pomaster left join `0_user_auth_matrix_for_po` pomatrix on pomaster.created_by = pomatrix.user_id where pomaster.id = "+ po +" and pomatrix.approver_level_1 = "+userid+" or pomatrix.approver_level_2 = " + userid    
    
    const sqlSearch1 = "update `0_po_master` pomaster ,`0_user_auth_matrix_for_po` pomatrix set pomaster.approval_1 = 'approved' where pomaster.created_by = pomatrix.user_id and pomaster.approval_1 is null and pomaster.rejection_reason_1 is null and pomaster.approval_2 is null and pomaster.rejection_reason_2 is null and pomaster.id = "+userid+" and pomatrix.approver_level_1 = " + userid 

    const sqlSearch2 = "update `0_po_master` pomaster ,`0_user_auth_matrix_for_po` pomatrix set pomaster.approval_2 = 'approved' where pomaster.created_by = pomatrix.user_id and pomaster.approval_1 is not null and pomaster.rejection_reason_1 is null and pomaster.approval_2 is null and pomaster.rejection_reason_2 is null and pomaster.id = "+userid+" and pomatrix.approver_level_2 = " + userid 
    
    connection.getConnection( (err, conn) => {
        if (err) throw err;

        conn.query(sqlSearch0, function(err, rows, fields) {
            if (err) throw err;

            console.log(rows[0], typeof(rows[0].id), typeof(userid))
            console.log("abc")
            console.log(rows[0] != null , parseInt(rows[0].id,10) == parseInt(userid,10) , rows[0].approval_1 == "approved", rows[0].rejection_reason_1 == null , rows[0].approval_2 == null ,rows[0].rejection_reason_1 == null)
            console.log(rows[0] != null , parseInt(rows[0].id,10) == parseInt(userid,10) , rows[0].approval_1 =="approved" , rows[0].rejection_reason_1 == null , rows[0].approval_2 == "approved" , rows[0].rejection_reason_1 == null)
            console.log(rows[0] != null , parseInt(rows[0].id,10) == parseInt(userid,10) , rows[0].approval_1 =="approved" , rows[0].rejection_reason_1 == null , rows[0].approval_2 == null , rows[0].rejection_reason_2 != null)
            console.log(rows[0] != null , parseInt(rows[0].id,10) == parseInt(userid,10) , rows[0].approval_1 == null , rows[0].rejection_reason_1 == null)
            console.log(rows[0] != null , parseInt(rows[0].id,10) == parseInt(userid,10) , rows[0].approval_1 == null , rows[0].rejection_reason_1 != null)
            console.log(rows[0] != null , parseInt(rows[0].id,10) == parseInt(userid,10))

            if (rows[0] != null && rows[0].id == userid && rows[0].approval_1 == "approved" && rows[0].rejection_reason_1 == null && rows[0].approval_2 == null && rows[0].rejection_reason_1 == null)  {
                
                conn.query(sqlSearch2, (err, result, fields) => {
                    if (err) throw err;

                    res.json({
                        status: true,
                        message: `PO# ${po} approved at L2`,
                        code: 2
                    })
                    
                })

            }
            if (rows[0] != null && rows[0].id == userid && rows[0].approval_1 =="approved" && rows[0].rejection_reason_1 == null && rows[0].approval_2 == "approved" && rows[0].rejection_reason_1 == null)  {
                
                conn.query(sqlSearch2, (err, result, fields) => {
                    if (err) throw err;

                    res.json({
                        status: false,
                        message: `PO# ${po} is already approved at L2`,
                        code: 0
                    })
                    
                })

            }
            if (rows[0] != null && rows[0].id == userid && rows[0].approval_1 =="approved" && rows[0].rejection_reason_1 == null && rows[0].approval_2 == null && rows[0].rejection_reason_2 != null)  {
                
                conn.query(sqlSearch2, (err, result, fields) => {
                    if (err) throw err;

                    res.json({
                        status: false,
                        message: `PO# ${po} is already rejected at L2 with reason: ${rows[0].rejection_reason_2}`,
                        code: -1
                    })
                    
                })

            }
            else if (rows[0] != null && rows[0].id == userid && rows[0].approval_1 == null && rows[0].rejection_reason_1 == null) {
                 
                conn.query(sqlSearch1, (err, result, fields) => {
                    if (err) throw err;

                    res.json({
                        status: true,
                        message: `PO# ${po} approved at L1`,
                        code: 2
                        
                    })
                    
                })
            }else if (rows[0] != null && rows[0].id == userid && rows[0].approval_1 == null && rows[0].rejection_reason_1 != null) {
                 
                conn.query(sqlSearch1, (err, result, fields) => {
                    if (err) throw err;

                    res.json({
                        status: false,
                        message: `PO# ${po} is already rejected at L1 with reason: ${rows[0].rejection_reason_1}`,
                        code: -1
                        
                    })
                    
                })
            }else if (rows[0] != null && rows[0].id != userid) {
                 
                res.status(401).json({
                    status: false,
                    message: `PO# ${po} cannot be approved by current user`, 
                    code: 0
                })
            }else {
                res.status(401).json({
                    status: false,
                    message: `PO# ${po} cannot be approved by current user at L1`, 
                    code: 0
                })
            }
           
            conn.release();
        });

    })

};

