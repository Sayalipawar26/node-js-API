const Joi = require("joi");
const User = require("../../models/users");
const CustomErrorhandler = require("../../services/CustomErrorHandler");
const bcrypt = require("bcrypt")
const JwtService = require("..//..//services/JwtService")
require('dotenv').config();
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const RefreshToken = require("../../models/RefreshToken")

const loginController ={
    async login (req,res,next){

     const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
     }) ;

     const {error} = loginSchema.validate(req.body);

     if(error){
        return next(error);
     }

     try {
        const user = await User.findOne({email : req.body.email});
        if(!user){
            return next(CustomErrorhandler.invalidCredentials())
        }
    
        const match = await bcrypt.compare(req.body.password,user.password);
        if(!match){
            return next(CustomErrorhandler.invalidCredentials())
        }
      
        const access_Token = JwtService.sign({ _id: user._id, role: user.role })
        const refresh_Token = JwtService.sign({ _id: user._id, role: user.role },'1y',REFRESH_TOKEN);

            await RefreshToken.create({token : refresh_Token })

        res.json({access_Token,refresh_Token });

     } catch (err) {
        return next(err);
     }

    }
}

module.exports = loginController;