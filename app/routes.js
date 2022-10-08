const mysql = require("mysql2")
var crypto = require('crypto');
const generateAccessToken = require("../utils/generateAccessToken")
const generateRefreshToken = require("../utils/generateRefreshToken")
const validateToken = require("../utils/validateToken")
const REST_GET = require('../routes/REST_GET')

let refreshTokens = []

module.exports = function (app, connection) {

//check
	app.get('/check', function (req, res) {
		res.send({ 
			status: true, 
			message: 'backend check' 
		}
		);
	});

//check2
	app.get("/check2", (req,res) => {

		querySQL = "SELECT * FROM 0_users";

		// connection.query(querySQL, function(err, rows, fields) {
			// if(err) 
			// {
			// 	res.json({
			// 		status : false,
			// 		message : err
			// 	})
			// 	throw err
			// }

			// if (rows.length != 0) {
			// 	res.json({
			// 			status : true,
			// 			message : rows
			// 		})
			// }else {
			// 	res.json({
			// 		status : false,
			// 		message : "no data"
			// 	})
			// }
		// })

		connection.getConnection((err, conn) => {
			if(err) 
			{
				res.json({
					status : false,
					message : err
				})
				throw err
			} else {
				conn.query(querySQL, (error, rows, fields) => {
					conn.release();
					// callback(error, results, fields);
					if (rows.length != 0) {
						res.json({
								status : true,
								message : rows
							})
					}else {
						res.json({
							status : false,
							message : "no data"
						})
					}
				});
			}
		})

	})

//create user
	app.post("/createuser", (req,res) => {
		const {name, real_name, role_id, phone} = req.body;
		const hashedPassword = crypto.createHash('md5').update(utf8.encode(req.body.password)).digest('hex')

		const sqlSearch = "SELECT * FROM 0_users WHERE user_id = ?"
		const search_query = mysql.format(sqlSearch,[name])
		var count = "SELECT count(*) FROM 0_users" + 1;
		const sqlInsert = "INSERT INTO 0_users(id, user_id, password, real_name, role_id, phone) Values (?,?,?,?,?,?)"
		const insert_query = mysql.format(sqlInsert,[count, name, hashedPassword, real_name, role_id, phone])
		// ? will be replaced by values
		// ?? will be replaced by string
		connection.query (search_query, async(err, result, fields) => {
			if(err) 
			{
				res.json({
					status : false,
					message : err
				})
				throw err
			}

			if (result.length != 0) {
				res.status(409).json({
					status : false,
					message : "User already exists"
				})
			} else {
				await connection.query (insert_query, (err, result)=> {
					if (err) throw (err)
					res.status(201).json({
						status : true,
						message : "Created new User",
						userid : result.insertId,
					})
				})
			}
		}) //end of connection.query()
	}) //end of app.post()

//login user
	app.post("/login", async(req, res)=> {
		const user = req.body.name
			const sqlSearch = "Select * from 0_users where user_id = ?"
			const search_query = mysql.format(sqlSearch,[user])
			 connection.query (search_query, (err, result, fields) => {
				if (err) {
					res.json({
						status : false,
						message : err
					})
					console.log(err)
					throw err
				}
				if (result.length == 0) {
					res.json({ //put status
						status : false,
						message : "User does not exist"
						})		
				} 
				else {
					const {password, role_id, email} = result[0]
					if (crypto.createHash('md5').update(req.body.password).digest('hex') === password) {
					
						const accessToken = generateAccessToken ({user})
						const refreshToken = generateRefreshToken ({user})
						refreshTokens.push(refreshToken);
						res.status(200).json({
							status : true,
							message : "login successful",
							details : {
								user,
								role_id,
								email,
								tokens : {accessToken, refreshToken},
							}})
					} else {
						res.json({ //res.status(401)
							status : false,
							message : "Password incorrect!",
						})
					} //end of pass comparion
				}//end of User exists i.e. results.length==0
			}) //end of connection.query()
	}) //end of app.post()

//refresh a access token
	app.put("/refreshtoken", (req,res) => {

		var {oldvalidrefreshtoken, username} = req.body;

		if (!refreshTokens.includes(oldvalidrefreshtoken)) {
			res.status(498).send({
				status : false,
				message : "Refresh Token Invalid/ Expired"	
			})
		}else {
			refreshTokens = refreshTokens.filter( (c) => c != oldvalidrefreshtoken)
			//remove the old refreshToken from the refreshTokens list
			const accessToken = generateAccessToken ({user: username})
			const refreshToken = generateRefreshToken ({user: username})
			//generate new accessToken and refreshTokens
			refreshTokens.push(refreshToken);
			//save token
			res.status(200).json({
				status : false,
				message : "tokens refresh successful",
				details : {
					user : username,
					tokens : {accessToken, refreshToken}
				}
			})
		}
	})

//validated content
	app.get("/posts", validateToken, (req, res)=>{
		res.send(`${req.user.user} successfully accessed post`)
	})

//logout
	app.post("/logout", (req,res)=>{
	refreshTokens = refreshTokens.filter( (c) => c != req.body.validrefreshtoken)
	//remove the old refreshToken from the refreshTokens list
	res.send({ //.status(204)
		status: true,
		message: "logout successful"
		})
	})

//PO Count
app.get('/pocount', validateToken, REST_GET.getPOCOUNT);
	
//PO with Details
app.get('/podetails', validateToken, REST_GET.getPODETAILS);
	
}
