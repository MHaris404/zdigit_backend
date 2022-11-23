var connection = require('../config/dbconnection');
const mysql = require("mysql2")

exports.updatePOapproval1 = function (req, res) {
    const { userid, po } = req.body;

    const sqlSearch0 = "select ifnull(pomaster.approval_1, '') as approval1 from `0_po_master` pomaster ,`0_user_auth_matrix_for_po` pomatrix where pomaster.created_by = pomatrix.user_id and pomaster.rejection_reason_1 is null and pomaster.id = "+ po +" and pomatrix.approver_level_1 = " + userid
    //const sqlSearch0_formatted = mysql.format(sqlSearch0, [userid, po])

    const sqlSearch1 = "update `0_po_master` pomaster ,`0_user_auth_matrix_for_po` pomatrix set pomaster.approval_1 = 'approved' where pomaster.created_by = pomatrix.user_id and pomaster.approval_1 is null and pomaster.rejection_reason_1 is null and pomaster.id = "+ po +" and pomatrix.approver_level_1 = " + userid
    //const sqlSearch1_formatted = mysql.format(sqlSearch1, [userid, po])

    connection.getConnection( (err, conn) => {
        if (err) throw err;

        conn.query(sqlSearch0, function(err, rows, fields) {
            if (err) throw err;

            console.log(rows[0])
            if (rows[0] != null && rows[0].approval1.length > 0) {
                res.json({
                    status : false,
                    message : "already approved",
                })
            }
            if (rows[0] == null) {
                
                conn.query(sqlSearch1, (err, result, fields) => {
                    if (err) throw err;

                    res.status(201).json({
                        status: true,
                        message: `Approved Level 1 of PO# ${po} `,
                        
                    })
                    
                })
            }
           
            conn.release();
        });

        // conn.query(sqlSearch0, (err, rows, fields) => {

        //     if (result != null || result[0].approval1.length == 0) {
        //         res.json({
        //             status : false,
        //             message : "already approved",
        //         })
        //     }
        //     if ( result == null || result.length <= 0) {
                
        //         conn.query(sqlSearch1, (err, result) => {

        //             console.log("inner query")
        //             console.log(result)

        //             if (err) {
        //                 res.json({
        //                     status: false,
        //                     message: err
        //                 })
        //             } else {
        //                 res.status(201).json({
        //                     status: true,
        //                     message: `Approved Level 1 of PO# ${po} `,
                            
        //                 })
        //             }
                    
        //             conn.release()
        //         })
        //     }

        // }) //end of connection.query()
    })

};



