const CustomErrorhandler = require("../services/CustomErrorHandler");
const JwtService = require("../services/JwtService");


const auth = async (req,res,next) => {
 
     let authHeaders = req.headers.authorization;
     console.log(authHeaders);

     if(!authHeaders){
          return next(CustomErrorhandler.unAuthorized)
     }

     const token = authHeaders.split(" ")[1]; 

     try {
          const {_id,role} = await JwtService.verify(token);
          const user = {
               _id,
               role
          }
          req.user = user;
          next();
          
     } catch (err) {
          return next(CustomErrorhandler.unAuthorized())
     }
}

module.exports = auth;
