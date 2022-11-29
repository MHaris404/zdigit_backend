var connection = require('../config/dbconnection');
const mysql = require("mysql2")

exports.updatePOapproval = function (req, res) {
    const { userid, po } = req.body;

    const sqlSearch0 = "select pomaster.id ,pomaster.approval_1, pomaster.approval_2, pomaster.rejection_reason_1 ,pomaster.rejection_reason_2, pomatrix.approver_level_1, pomatrix.approver_level_2 from `0_po_master` pomaster left join `0_user_auth_matrix_for_po` pomatrix on pomaster.created_by = pomatrix.user_id where pomaster.id = " + po + " and pomatrix.approver_level_1 = " + userid + " or pomatrix.approver_level_2 = " + userid

    connection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(sqlSearch0, function (err, rows, fields) {
            if (err) throw err;

            console.log(userid, po)
            var rowsFiltered =  rows.filter(row => {
                return row.id == po
            })
            console.log("FILTERED")
            console.log(rowsFiltered)

            if(rowsFiltered.level > 0){
                if (rows[0] != null && rowsFiltered[0].id == po && rowsFiltered[0].approval_1 == "approved" && rowsFiltered[0].rejection_reason_1 == null && rowsFiltered[0].approval_2 == null && rowsFiltered[0].rejection_reason_2 == null) {

                    if (rowsFiltered[0].approver_level_2 == userid)
                        conn.query("update `0_po_master` pomaster ,`0_user_auth_matrix_for_po` pomatrix set pomaster.approval_2 = 'approved' where pomaster.created_by = pomatrix.user_id and pomaster.approval_1 = 'approved' and pomaster.rejection_reason_1 is null and pomaster.approval_2 is null and pomaster.rejection_reason_2 is null and pomaster.id = ? and pomatrix.approver_level_2 = ? ", [po, userid], (err, result, fields) => {
                            if (err) throw err;

                            console.log("RESULTS")
                            console.log(result)
                            console.log("RESULT END")

                            res.status(200).json({
                                status: true,
                                message: `PO# ${po} approved at L2`,
                                code: 1,
                                level: 2
                            }).end()

                        })
                    else {
                        res.status(401).json({
                            status: false,
                            message: `PO# ${po} cannot be approved by current user at L2`,
                            code: 0
                        }).end()
                    }

                }
                else if (rows[0] != null && rowsFiltered[0].id == po && rowsFiltered[0].approval_1 == "approved" && rowsFiltered[0].rejection_reason_1 == null && rowsFiltered[0].approval_2 == "approved" && rowsFiltered[0].rejection_reason_2 == null) {

                    res.status(200).json({
                        status: false,
                        message: `PO# ${po} is already approved at L2`,
                        code: 0
                    }).end()
                }
                else if (rows[0] != null && rowsFiltered[0].id == po && rowsFiltered[0].approval_1 == "approved" && rowsFiltered[0].rejection_reason_1 == null && rowsFiltered[0].approval_2 == "rejected" && rowsFiltered[0].rejection_reason_2 != null) {

                    res.status(200).json({
                        status: false,
                        message: `PO# ${po} is already rejected at L2 with reason: ${rowsFiltered[0].rejection_reason_2}`,
                        code: -1
                    }).end()

                }
                else if (rows[0] != null && rowsFiltered[0].id == po && rowsFiltered[0].approval_1 == null && rowsFiltered[0].rejection_reason_1 == null && rowsFiltered[0].approval_2 == null && rowsFiltered[0].rejection_reason_2 == null) {

                    if (rowsFiltered[0].approver_level_1 == userid) {
                        conn.query("update `0_po_master` pomaster ,`0_user_auth_matrix_for_po` pomatrix set pomaster.approval_1 = 'approved' where pomaster.created_by = pomatrix.user_id and pomaster.approval_1 is null and pomaster.rejection_reason_1 is null and pomaster.approval_2 is null and pomaster.rejection_reason_2 is null and pomaster.id = ? and pomatrix.approver_level_1 = ?", [po, userid], (err, result, fields) => {
                            if (err) throw err;

                                res.status(200).json({
                                    status: true,
                                    message: `PO# ${po} approved at L1`,
                                    code: 1,
                                    level: 1

                                }).end()
                        })
                    }
                    else {
                        res.status(401).json({
                            status: false,
                            message: `PO# ${po} cannot be approved by current user at L1`,
                            code: 0
                        }).end()
                    }

                } 
                else if (rows[0] != null && rowsFiltered[0].id == po && rowsFiltered[0].approval_1 == "rejected" && rowsFiltered[0].rejection_reason_1 != null && rowsFiltered[0].approval_2 == null && rowsFiltered[0].rejection_reason_2 == null) {

                    res.status(200).json({
                        status: false,
                        message: `PO# ${po} is already rejected at L1 with reason: ${rowsFiltered[0].rejection_reason_1}`,
                        code: -1

                    }).end()

                } 
                else if (rows[0] != null && rowsFiltered[0].id != po) {

                    res.status(401).json({
                        status: false,
                        message: `PO# ${po} cannot be approved by current user`,
                        code: 0
                    }).end()

                    console.log("ROWS")
                    console.log(rowsFiltered[0])

                } 
                else {

                    res.status(401).json({
                        status: false,
                        message: `PO# ${po} cannot be approved by current user`,
                        code: 0,
                        result: rows[0]
                    }).end()

                }
            }
            else{
                res.status(401).json({
                    status: false,
                    message: `PO# ${po} cannot be approved by current user`,
                    code: 0
                }).end()

                console.log("ROWS 1")
                console.log(rowsFiltered[0])
            }

        });

        conn.release();

    })

};

exports.updatePOrejection = function (req, res) {
    const { userid, po, reason } = req.body;

    const sqlSearch0 = "select pomaster.id ,pomaster.approval_1, pomaster.approval_2, pomaster.rejection_reason_1 ,pomaster.rejection_reason_2, pomatrix.approver_level_1, pomatrix.approver_level_2 from `0_po_master` pomaster left join `0_user_auth_matrix_for_po` pomatrix on pomaster.created_by = pomatrix.user_id where pomaster.id = " + po + " and pomatrix.approver_level_1 = " + userid + " or pomatrix.approver_level_2 = " + userid

    connection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(sqlSearch0, function (err, rows, fields) {
            console.log(rows)

            if (err) throw err;

            var rowsFiltered =  rows.filter(row => {
                return row.id == po
            })

            if(rowsFiltered.level > 0){
                if (rows[0] != null && rowsFiltered[0].id == po && rowsFiltered[0].approval_1 == "rejected" && rowsFiltered[0].rejection_reason_1 != null && rowsFiltered[0].approval_2 == null && rowsFiltered[0].rejection_reason_2 == null) {

                    // if (rows[0].approver_level_2 == userid)
                        
                    //     conn.query("update `0_po_master` pomaster ,`0_user_auth_matrix_for_po` pomatrix set pomaster.rejection_reason_2 = 'reject' where pomaster.created_by = pomatrix.user_id and pomaster.rejection_reason_1 is not null and pomaster.approval_1 is null and pomaster.rejection_reason_2 is null and pomaster.approval_2 is null and pomaster.id = ? and pomatrix.approver_level_2 = ? ", [po, userid], (err, result, fields) => {
                    //         if (err) throw err;

                    //             res.status(200).json({
                    //                 status: true,
                    //                 message: `PO# ${po} rejected at L2`,
                    //                 code: 1,
                    //                 level: 2
                    //             }).end()

                    //     })
                    // else {
                    //     res.status(401).json({
                    //         status: false,
                    //         message: `PO# ${po} cannot be rejected by current user at L2`,
                    //         code: 0
                    //     }).end()
                    // }

                    res.status(200).json({
                        status: false,
                        message: `PO# ${po} is already rejected at L1 with reason: ${rowsFiltered[0].rejection_reason_1}`,
                        code: -1
                    }).end()

                }           
                else if (rows[0] != null && rowsFiltered[0].id == po && rowsFiltered[0].rejection_reason_1 != null && rowsFiltered[0].approval_1 == "rejected" && rowsFiltered[0].approval_2 == "rejected" && rowsFiltered[0].rejection_reason_2 != null) {

                    res.status(200).json({
                        status: false,
                        message: `PO# ${po} is already rejected at L2 with reason: ${rowsFiltered[0].rejection_reason_2}`,
                        code: -1
                    }).end()

                }
                else if (rows[0] != null && rowsFiltered[0].id == po && rowsFiltered[0].approval_1 == "approved" && rowsFiltered[0].rejection_reason_1 == null && rowsFiltered[0].approval_2 == "approved" && rowsFiltered[0].rejection_reason_2 == null) {

                    res.status(200).json({
                        status: false,
                        message: `PO# ${po} is already approved at L2}`,
                        code: -1
                    }).end()

                }
                else if (rows[0] != null && rowsFiltered[0].id == po && rowsFiltered[0].approval_1 == null && rowsFiltered[0].rejection_reason_1 == null && rowsFiltered[0].approval_2 == null && rowsFiltered[0].rejection_reason_2 == null) 
                {

                    if (rowsFiltered[0].approver_level_1 == userid) {
                        conn.query("update `0_po_master` pomaster ,`0_user_auth_matrix_for_po` pomatrix set pomaster.approval_1 = 'rejected' , pomaster.rejection_reason_1 = ? where pomaster.created_by = pomatrix.user_id and pomaster.approval_1 is null and pomaster.rejection_reason_1 is null and pomaster.approval_2 is null and pomaster.rejection_reason_2 is null and pomaster.id = ? and pomatrix.approver_level_1 = ?", [reason, po, userid], (err, result, fields) => {
                            if (err) throw err;

                                res.status(200).json({
                                    status: true,
                                    message: `PO# ${po} rejected at L1`,
                                    code: 1,
                                    level: 1

                                }).end()
                        })
                    }
                    else {
                        res.status(401).json({
                            status: false,
                            message: `PO# ${po} cannot be rejected by current user at L1`,
                            code: 0
                        }).end()
                    }

                } 
                else if (rows[0] != null && rowsFiltered[0].id == po && rowsFiltered[0].approval_1 == "approved" && rowsFiltered[0].rejection_reason_1 == null && rowsFiltered[0].approval_2 == null && rowsFiltered[0].rejection_reason_2 == null) 
                {

                    if (rowsFiltered[0].approver_level_2 == userid)
                        
                        conn.query("update `0_po_master` pomaster ,`0_user_auth_matrix_for_po` pomatrix set pomaster.approval_2 = 'rejected', pomaster.rejection_reason_2 = ? where pomaster.created_by = pomatrix.user_id and pomaster.rejection_reason_1 is null and pomaster.approval_1 = 'approved' and pomaster.rejection_reason_2 is null and pomaster.approval_2 is null and pomaster.id = ? and pomatrix.approver_level_2 = ? ", [reason, po, userid], (err, result, fields) => {
                            if (err) throw err;

                                res.status(200).json({
                                    status: true,
                                    message: `PO# ${po} rejected at L2`,
                                    code: 1,
                                    level: 2
                                }).end()

                        })
                    else {
                        res.status(401).json({
                            status: false,
                            message: `PO# ${po} cannot be rejected by current user at L2`,
                            code: 0
                        }).end()
                    }

                }
                else if (rows[0] != null && rowsFiltered[0].id != po) 
                {
                    res.status(401).json({
                        status: false,
                        message: `PO# ${po} cannot be rejected by current user`,
                        code: 0
                    }).end()
                } 
                else 
                {
                    res.status(401).json({
                        status: false,
                        message: `PO# ${po} cannot be rejected by current user`,
                        code: 0,
                        result: rows[0]
                    }).end()
                }
            }
            else{
                res.status(401).json({
                    status: false,
                    message: `PO# ${po} cannot be approved by current user`,
                    code: 0
                }).end()

                console.log("ROWS 1")
                console.log(rowsFiltered[0])
            }

        });

        conn.release();

    })

};

