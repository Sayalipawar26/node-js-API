require('dotenv').config();
const jwtweb = process.env.JWT_TOKEN;
const jwt = require("jsonwebtoken");

class JwtService {
    static sign(payload,expiry="60s",secret=jwtweb){
         return jwt.sign(payload,secret,{expiresIn:expiry})
    }
    static verify(token,secret=jwtweb){
        return jwt.verify(token,secret)
   }
}

module.exports=JwtService;