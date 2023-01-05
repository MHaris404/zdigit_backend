const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    //get token from request header
    const authHeader = req.headers["authorization"]
    const token = authHeader.split(" ")[1]
    //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
    //for postman: use auth2.0
    if (token == null) 
        res.status(400).json({
            status : false,
            message : "Token not present"
        })
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) { 
            res.status(403).json({
                status : false,
                message : "Access Token invalid"        
            })
        }
        else {
            req.user = user
            next() //proceed to the next action in the calling function
        }
    }) //end of jwt.verify()
} //end of function