const jwt = require("jsonwebtoken")
require("dotenv-extended").config()

module.exports= (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET); //default 365 days
    //, {expiresIn: "3m"}
}
