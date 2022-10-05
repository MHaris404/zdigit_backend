const jwt = require("jsonwebtoken")
require("dotenv").config()

module.exports= (user) => {

    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET) //default 60 days
    //, {expiresIn: "20s"}

}