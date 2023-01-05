var connection = require('../config/dbconnection');
const mysql = require("mysql2");
const { user } = require('../config/database');
const e = require('connect-timeout');

exports.updatePOapproval = function (req, res) {
    const { userid, po } = req.body;

    const sqlSearch0 = "select pomaster.id ,pomaster.approval_1, pomaster.approval_2, pomaster.rejection_reason_1 ,pomaster.rejection_reason_2, pomatrix.approver_level_1, pomatrix.approver_level_2 from `0_po_master` pomaster left join `0_user_auth_matrix_for_po` pomatrix on pomaster.created_by = pomatrix.user_id where pomaster.id = " + po + " and pomatrix.approver_level_1 = " + userid + " or pomatrix.approver_level_2 = " + userid

    connection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(sqlSearch0, function (err, rows, fields) {
            if (err) throw err;

            console.log(userid, po)
            var rowsFiltered = rows.filter(row => {
                return row.id == po
            })

            if (rowsFiltered.length > 0) {
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
            else {
                res.status(401).json({
                    status: false,
                    message: `PO# ${po} cannot be approved by current user`,
                    code: 0
                }).end()

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

            var rowsFiltered = rows.filter(row => {
                return row.id == po
            })

            if (rowsFiltered.length > 0) {
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
                        message: `PO# ${po} is already approved at L2`,
                        code: -1
                    }).end()

                }
                else if (rows[0] != null && rowsFiltered[0].id == po && rowsFiltered[0].approval_1 == null && rowsFiltered[0].rejection_reason_1 == null && rowsFiltered[0].approval_2 == null && rowsFiltered[0].rejection_reason_2 == null) {

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
                else if (rows[0] != null && rowsFiltered[0].id == po && rowsFiltered[0].approval_1 == "approved" && rowsFiltered[0].rejection_reason_1 == null && rowsFiltered[0].approval_2 == null && rowsFiltered[0].rejection_reason_2 == null) {

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
                else if (rows[0] != null && rowsFiltered[0].id != po) {
                    res.status(401).json({
                        status: false,
                        message: `PO# ${po} cannot be rejected by current user`,
                        code: 0
                    }).end()
                }
                else {
                    res.status(401).json({
                        status: false,
                        message: `PO# ${po} cannot be rejected by current user`,
                        code: 0,
                        result: rows[0]
                    }).end()
                }
            }
            else {
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

exports.updatePOapprovalMultiple = function (req, res) {
    const { userid, poarray } = req.body;
    var pos = poarray.join(",") + ")"
    var multipleResult = []

    const sqlSearch0 = "SELECT pomaster.id, pomaster.approval_1, pomaster.approval_2, pomaster.rejection_reason_1, pomaster.rejection_reason_2, pomatrix.approver_level_1, pomatrix.approver_level_2 FROM `0_po_master` pomaster INNER JOIN `0_user_auth_matrix_for_po` pomatrix ON pomaster.created_by = pomatrix.user_id WHERE pomaster.id in (" + pos

    connection.getConnection((err, conn) => {
        if (err) throw err;

        conn.promise().query(sqlSearch0)
            .then(async function (result) {

                var rowsFiltered0 = result[0].filter((row, i) => {
                    return row.approver_level_1 == userid || row.approver_level_2 == userid
                })

                let p1 =[], p2 =[], p3 =[], p4 =[], p5 =[], p6 =[], p7 =[],p8 =[], p9 =[];

                if (rowsFiltered0.length > 0) {

                    rowsFiltered0.map(function (item) {

                        if (item.approval_1 == "approved" && item.rejection_reason_1 == null && item.approval_2 == null && item.rejection_reason_2 == null) {

                            if (item.approver_level_2 == userid) {

                                p1.push(new Promise((resolve, reject) => {
                                    conn.query("update `0_po_master` pomaster ,`0_user_auth_matrix_for_po` pomatrix set pomaster.approval_2 = 'approved' where pomaster.created_by = pomatrix.user_id and pomaster.approval_1 = 'approved' and pomaster.rejection_reason_1 is null and pomaster.approval_2 is null and pomaster.rejection_reason_2 is null and pomaster.id = ? and pomatrix.approver_level_2 = ? ", [item.id, userid], (err, result, fields) => {
                                        if (err) reject(err);

                                        resolve({
                                            status: true,
                                            message: `PO# ${item.id} approved at L2`,
                                            code: 1,
                                            level: 2,
                                            po: item.id
                                        })

                                    })

                                }));
                               
                            }
                            else {

                                p2.push(new Promise((resolve, reject) => {

                                    resolve({
                                        status: false,
                                        message: `PO# ${item.id} cannot be approved by current user at L2`,
                                        code: 0
                                    })
                                }));
                            }

                        }
                        else if (item.approval_1 == "approved" && item.rejection_reason_1 == null && item.approval_2 == "approved" && item.rejection_reason_2 == null) {

                            p3.push(new Promise((resolve, reject) => {
                                resolve({
                                    status: false,
                                    message: `PO# ${item.id} is already approved at L2`,
                                    code: 0
                                })
                            }));

                        }
                        else if (item.approval_1 == "approved" && item.rejection_reason_1 == null && item.approval_2 == "rejected" && item.rejection_reason_2 != null) {

                            p4.push(new Promise((resolve, reject) => {
                                resolve({
                                    status: false,
                                    message: `PO# ${item.id} is already rejected at L2 with reason: ${item.rejection_reason_2}`,
                                    code: -1
                                })
                            }));

                        }
                        else if (item.approval_1 == null && item.rejection_reason_1 == null && item.approval_2 == null && item.rejection_reason_2 == null) {

                            if (item.approver_level_1 == userid) {

                                p5.push(new Promise((resolve, reject) => {
                                    conn.query("update `0_po_master` pomaster ,`0_user_auth_matrix_for_po` pomatrix set pomaster.approval_1 = 'approved' where pomaster.created_by = pomatrix.user_id and pomaster.approval_1 is null and pomaster.rejection_reason_1 is null and pomaster.approval_2 is null and pomaster.rejection_reason_2 is null and pomaster.id = ? and pomatrix.approver_level_1 = ?", [item.id, userid], (err, result, fields) => {
                                        if (err) reject(err);

                                        resolve({
                                            status: true,
                                            message: `PO# ${item.id} approved at L1`,
                                            code: 1,
                                            level: 1,
                                            po: item.id
                                        })
                                    })
                                }));
                            }
                            else {
                                p6.push(new Promise((resolve, reject) => {
                                    resolve({
                                        status: false,
                                        message: `PO# ${item.id} cannot be approved by current user at L1`,
                                        code: 0
                                    })
                                }));
                            }

                        }
                        else if (item.approval_1 == "rejected" && item.rejection_reason_1 != null && item.approval_2 == null && item.rejection_reason_2 == null) {

                            p7.push(new Promise((resolve, reject) => {

                                resolve({
                                    status: false,
                                    message: `PO# ${item.id} is already rejected at L1 with reason: ${item.rejection_reason_1}`,
                                    code: -1

                                })
                            }));

                        }
                        else {

                            p8.push(new Promise((resolve, reject) => {
                                resolve({
                                    status: false,
                                    message: `PO# ${item.id} cannot be approved by current user`,
                                    code: 0
                                })
                            }))
                        }

                    })

                } else {

                    p9.push(new Promise((resolve, reject) => {

                        if (poarray.length > 1) {
                            resolve({
                                status: false,
                                message: `POs cannot be approved by current user`,
                                code: 0
                            })
                            
                            console.log("91", multipleResult.length)
                        } else {
                            resolve({
                                status: false,
                                message: `PO cannot be approved by current user`,
                                code: 0
                            })
                            console.log("92", multipleResult.length)
                        }
                    }));
                }

                return Promise.all([...p1, ...p2, ...p3, ...p4, ...p5, ...p6, ...p7, ...p8, ...p9]).then((results) => {
                    multipleResult = results.filter(item => item != null)
                });

            })
            .then(function (arrayOfResults) {

                multipleResult.push(arrayOfResults)
                multipleResult.pop()

                if (poarray.length - multipleResult.length > 0) {

                    multipleResult.push({
                        status: false,
                        message: `Other POs cannot be approved by current user`,
                        code: 0
                    })

                }

                res.json({ "acceptMultiple": multipleResult }).end()
            })
            .catch((err) => console.log(err));

        conn.release();

    })

};

exports.updatePOrejectionMultiple = function (req, res) {
    const { userid, poarray, reason } = req.body;
    var pos = poarray.join(",") + ")"
    var multipleResult = []
    const sqlSearch0 = "SELECT pomaster.id, pomaster.approval_1, pomaster.approval_2, pomaster.rejection_reason_1, pomaster.rejection_reason_2, pomatrix.approver_level_1, pomatrix.approver_level_2 FROM `0_po_master` pomaster INNER JOIN `0_user_auth_matrix_for_po` pomatrix ON pomaster.created_by = pomatrix.user_id WHERE pomaster.id in (" + pos

    connection.getConnection((err, conn) => {
        if (err) throw err;

        conn.promise().query(sqlSearch0)
            .then(async function (result) {

                var rowsFiltered0 = result[0].filter((row, i) => {
                    return row.approver_level_1 == userid || row.approver_level_2 == userid
                })

                let p1 =[], p2 =[], p3 =[], p4 =[], p5 =[], p6 =[], p7 =[],p8 =[], p9 =[];
                rowsFiltered0.map(function (item) {

                    if (item.approval_1 == "rejected" && item.rejection_reason_1 != null && item.approval_2 == null && item.rejection_reason_2 == null) {

                        p1.push(new Promise((resolve, reject) => {

                            resolve({
                                status: false,
                                message: `PO# ${item.id} is already rejected at L1 with reason: ${item.rejection_reason_1}`,
                                code: -1
                            })

                        }));

                    }
                    else if (item.rejection_reason_1 != null && item.approval_1 == "rejected" && item.approval_2 == "rejected" && item.rejection_reason_2 != null) {

                        p2.push(new Promise((resolve, reject) => {

                            resolve({
                                status: false,
                                message: `PO# ${item.id} is already rejected at L2 with reason: ${item.rejection_reason_2}`,
                                code: -1
                            })

                        }));

                    }
                    else if (item.approval_1 == 'approved' && item.rejection_reason_1 == null && item.approval_2 == "approved" && item.rejection_reason_2 == null) {

                        p3.push(new Promise((resolve, reject) => {

                            resolve({
                                status: false,
                                message: `PO# ${item.id} is already approved at L2`,
                                code: -1
                            })

                        }));

                    }
                    else if (item.approval_1 == null && item.rejection_reason_1 == null && item.approval_2 == null && item.rejection_reason_2 == null) {

                        if (item.approver_level_1 == userid) {

                            p4.push(new Promise((resolve, reject) => {

                                conn.query("update `0_po_master` pomaster ,`0_user_auth_matrix_for_po` pomatrix set pomaster.approval_1 = 'rejected' , pomaster.rejection_reason_1 = ? where pomaster.created_by = pomatrix.user_id and pomaster.approval_1 is null and pomaster.rejection_reason_1 is null and pomaster.approval_2 is null and pomaster.rejection_reason_2 is null and pomaster.id = ? and pomatrix.approver_level_1 = ?", [reason, item.id, userid], (err, result, fields) => {
                                    if (err) reject(err);

                                    resolve({
                                        status: true,
                                        message: `PO# ${item.id} rejected at L1`,
                                        code: 1,
                                        level: 1,
                                        po: item.id

                                    })
                                })

                            }));

                        }
                        else {

                            p5.push(new Promise((resolve, reject) => {

                                resolve({
                                    status: false,
                                    message: `PO# ${item.id} cannot be rejected by current user at L1`,
                                    code: 0
                                })

                            }));
                        }

                    }
                    else if (item.approval_1 == "approved" && item.rejection_reason_1 == null && item.approval_2 == null && item.rejection_reason_2 == null) {

                        if (item.approver_level_2 == userid) {

                            p6.push(new Promise((resolve, reject) => {

                                conn.query("update `0_po_master` pomaster ,`0_user_auth_matrix_for_po` pomatrix set pomaster.approval_2 = 'rejected', pomaster.rejection_reason_2 = ? where pomaster.created_by = pomatrix.user_id and pomaster.rejection_reason_1 is null and pomaster.approval_1 = 'approved' and pomaster.rejection_reason_2 is null and pomaster.approval_2 is null and pomaster.id = ? and pomatrix.approver_level_2 = ? ", [reason, item.id, userid], (err, result, fields) => {
                                    if (err) reject(err);

                                    resolve({
                                        status: true,
                                        message: `PO# ${item.id} rejected at L2`,
                                        code: 1,
                                        level: 2,
                                        po: item.id
                                    })

                                })

                            }));


                        }
                        else {

                            p7.push(new Promise((resolve, reject) => {

                                resolve({
                                    status: false,
                                    message: `PO# ${item.id} cannot be rejected by current user at L2`,
                                    code: 0
                                })

                            }));

                        }
                    }
                    else if (item.approval_1 == "approved" && item.rejection_reason_1 == null && item.approval_2 == "rejected" && item.rejection_reason_2 != null) {

                        p8.push(new Promise((resolve, reject) => {
                            resolve({
                                status: false,
                                message: `PO# ${item.id} is already rejected at L2 with reason: ${item.rejection_reason_2}`,
                                code: -1
                            })
                        }));

                    }
                    else {

                        p9.push(new Promise((resolve, reject) => {
                            resolve({
                                status: false,
                                message: `PO# ${item.id} cannot be rejected by current user`,
                                code: 0
                            })
                            console.log("9", multipleResult.length)
                        }));
                    }

                })

                return Promise.all([...p1, ...p2, ...p3, ...p4, ...p5, ...p6, ...p7, ...p8, ...p9]).then((results) => {
                    multipleResult = results.filter(item => item != null)
                });


            })
            .then(function (arrayOfResults) {

                multipleResult.push(arrayOfResults)
                multipleResult.pop()

                if (poarray.length - multipleResult.length > 0) {

                    multipleResult.push({
                        status: false,
                        message: `Other POs cannot be rejected by current user`,
                        code: 0
                    })

                }

                res.json({ "rejectMultiple": multipleResult }).end()
            })
            .catch((err) => console.log(err));

        conn.release();

    })

};

