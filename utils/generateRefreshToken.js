const jwt = require("jsonwebtoken")
require("dotenv").config()

module.exports= (user) => {

    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "20m"});
    
}
