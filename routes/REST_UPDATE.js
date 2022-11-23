var connection = require('../config/dbconnection');
const mysql = require("mysql2")

exports.updatePOapproval1 = function (req, res) {
    const { userid, po } = req.body;


    const sqlSearch0 = "select ifnull(pomaster.approval_1, 0) as approval1 from `0_po_master` pomaster ,`0_user_auth_matrix_for_po` pomatrix where pomaster.created_by = pomatrix.user_id and pomaster.approval_1 is not null and pomaster.rejection_reason_1 is null and pomaster.id = ? and pomatrix.approver_level_1 = ?"
    const sqlSearch0_formatted = mysql.format(sqlSearch0, [userid, po])

    const sqlSearch1 = "update `0_po_master` pomaster ,`0_user_auth_matrix_for_po` pomatrix set pomaster.approval_1 = 'approved' where pomaster.created_by = pomatrix.user_id and pomaster.approval_1 is null and pomaster.rejection_reason_1 is null and pomaster.id = ? and pomatrix.approver_level_1 = ?"
    const sqlSearch1_formatted = mysql.format(sqlSearch1, [userid, po])

    connection.getConnection( (err, conn) => {
        if (err) {
            res.json({
                status: false,
                message: err
            })
        }
         conn.query(sqlSearch0_formatted, async (err, result, fields) => {

            console.log("query")
            console.log(result)

            if (err) {
                res.json({
                    status: false,
                    message: err
                })
                conn.release()
            }
            if (result == null | result.length <= 0) {
                
                console.log(result)
                if (result.approval1 != null | result.approval1.length > 0) {
                    res.json({
                                status: false,
                                message: "asa"
                            })
                            conn.release()
                } else {

                    await conn.query(sqlSearch1_formatted, (err, result) => {

                        console.log("inner query")
                        console.log(result)

                        if (err) {
                            res.json({
                                status: false,
                                message: err
                            })
                            conn.release()
                        } else {
                            res.status(201).json({
                                status: true,
                                message: `Approved Level 1 of PO# ${po} `,
                                
                            })
                        }
                    })
                }
            }//end

        }) //end of connection.query()
    })

};



