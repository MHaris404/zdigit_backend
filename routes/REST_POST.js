
// endpoint/v1/product/api/add/category?
exports.addOneCategory = function (req, res) {
	var connection = require('../config/dbconnection');
	var response = [];

	var content = {
		categoryName: req.query.categoryName,
		categoryScore: req.query.categoryScore
	};

	connection.query('INSERT INTO categories SET ?', content,
		function (err, result) {
			if (!err) {

				if (result.affectedRows != 0) {
					response.push({ status: true, msg: "successfully added " + req.query.categoryName, result: result });
				} else {
					response.push({ status: false, msg: 'No row affected' });
				}

				res.setHeader('Content-Type', 'application/json');
				res.status(200).send(JSON.stringify(response));
			} else {
				res.status(400).send({ success: false, msg: err.sqlMessage });
			}
		});

};

// endpoint/v1/product/api/add/question?option1?option2?option3?option4?correctOption?
exports.addOneQuestion = function (req, res) {
	var connection = require('../config/dbconnection');
	var response = [];

	var content = {
		question: req.query.question,
		categoryid: req.query.categoryid,
		option1: req.query.option1,
		option2: req.query.option2,
		option3: req.query.option3,
		option4: req.query.option4,
		correctOption: req.query.correctOption
	};

	connection.query('INSERT INTO questions SET ? ', content,
		function (err, result) {
			if (!err) {

				if (result.affectedRows != 0) {
					response.push({ status: true, msg: "successfully added " + req.query.question, result: result });
				} else {
					response.push({ status: false, msg: 'No row affected' });
				}

				res.setHeader('Content-Type', 'application/json');
				res.status(200).send(JSON.stringify(response));
			} else {
				res.status(400).send({ success: false, msg: err.sqlMessage });
			}
		});

};

// endpoint/v1/product/api/add/option?
// exports.addOptions = function (req, res) {
// 	var connection = require('../model/dbconnection');
// 	var response = [];

// 	var content = {
// 		questionid: req.query.questionid,
// 		option1: req.query.option1,
// 		option2: req.query.option2,
// 		option3: req.query.option3,
// 		option4: req.query.option4,
// 		correctOption: req.query.correctOption
// 	};

// 	connection.query('INSERT INTO options SET ? ', content,
// 		function (err, result) {
// 			if (!err) {

// 				if (result.affectedRows != 0) {
// 					response.push({ status: true, msg: "successfully added ", result: result });
// 				} else {
// 					response.push({ status: false, msg: 'No row affected' });
// 				}

// 				res.setHeader('Content-Type', 'application/json');
// 				res.status(200).send(JSON.stringify(response));
// 			} else {
// 				res.status(400).send({ success: false, msg: err.sqlMessage });
// 			}
// 		});

// };

// endpoint/v1/product/api/add/score?
//http://${IP}:5000/endpoint/v1/add/score?userCategoryScore=${score}&categoryid=${catId}&usersid=${userid}

exports.addUserCategoryScore = function (req, res) {
	var connection = require('../config/dbconnection');
	var response = [];

	var content = {
		usersid: req.query.usersid,
		categoryid: req.query.categoryid,
		userCategoryScore: req.query.userCategoryScore,
		categoryName: req.query.categoryName
	};

	connection.query(`SELECT COUNT(1) as counter FROM scores WHERE usersid = ${content.usersid} AND categoryid = ${content.categoryid}`,
		function (err, result) {
			if (!err) {

				if (result[0].counter != 0) {

					let query = `SELECT id FROM scores WHERE usersid = ${content.usersid} AND categoryid = ${content.categoryid}`;
					connection.query(query,
						function (err, result) {
							if (!err) {

								connection.query(`UPDATE scores SET userCategoryScore = ${content.userCategoryScore} WHERE id = ${result[0].id}`,
									function (err, result) {

										if (!err) {

											if (result.affectedRows != 0) {
												response.push({ status: true, msg: "Successfully saved ", result: result });
											} else {
												response.push({ status: false, msg: 'No row affected' });
											}

											res.setHeader('Content-Type', 'application/json');
											res.status(200).send(JSON.stringify(response));
										} else {
											res.status(400).send({ success: false, msg: err.sqlMessage });
										}
									});

							} else {
								res.status(400).send({ success: false, msg: err.sqlMessage });
							}
						});

				} else {

					connection.query(`INSERT INTO scores SET ?`, content,
						function (err, result) {

							if (!err) {

								if (result.affectedRows != 0) {
									response.push({ status: true, msg: "Successfully saved ", result: result });
								} else {
									response.push({ status: false, msg: 'No row affected' });
								}

								res.setHeader('Content-Type', 'application/json');
								res.status(200).send(JSON.stringify(response));
							} else {
								res.status(400).send({ success: false, msg: err.sqlMessage });
							}
						});

				}

			} else {
				res.status(400).send({ success: false, msg: err.sqlMessage });
			}
		});

};

// endpoint/v1/product/api/add/batch/?content[0]=1,2,3,...& content[1]=1,2,3...
exports.addBatch = function (req, res) {
	var connection = require('../config/dbconnection');
	var response = [];

	// make sure all required fields are provided
	if (
		typeof req.query.content !== 'undefined'
	) {

		// initial an array to store all records to insert
		var arr = [];
		// pair each record with columns
		for (i = 0; i < req.query.content.length; i++) {
			// split contents
			var tmpArr = req.query.content[i].split(',');
			var tmpContent = {
				Row_ID: tmpArr[0],
				Order_ID: tmpArr[1],
				Order_Date: tmpArr[2],
				Order_Priority: tmpArr[3],
				Order_Quantity: tmpArr[4],
				Sales: tmpArr[5],
				Discount: tmpArr[6],
				Ship_Mode: tmpArr[7],
				Profit: tmpArr[8],
				Unit_Price: tmpArr[9],
				Shipping_Cost: tmpArr[10],
				Customer_Name: tmpArr[11],
				Province: tmpArr[12],
				Region: tmpArr[13],
				Customer_Segment: tmpArr[14],
				Product_Category: tmpArr[15],
				Product_Sub_Category: tmpArr[16],
				Product_Name: tmpArr[17],
				Product_Container: tmpArr[18],
				Product_Base_Margin: tmpArr[19],
				Ship_Date: tmpArr[20]
			};
			// add formated record to array
			arr.push(tmpContent);
		}

		connection.query('INSERT INTO users SET ?', arr,
			function (err, result) {
				if (!err) {

					if (result.affectedRows != 0) {
						response.push({ 'result': 'success' });
					} else {
						response.push({ 'msg': 'No Result Found' });
					}

					res.setHeader('Content-Type', 'application/json');
					res.status(200).send(JSON.stringify(response));
				} else {
					res.status(400).send(err);
				}
			});

	} else {
		response.push({ 'result': 'error', 'msg': 'Please fill required details' });
		res.setHeader('Content-Type', 'application/json');
		res.status(200).send(JSON.stringify(response));
	}
};
