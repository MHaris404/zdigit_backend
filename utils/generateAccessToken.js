const jwt = require("jsonwebtoken")
require("dotenv").config()

module.exports= (user) => {

    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"})

}