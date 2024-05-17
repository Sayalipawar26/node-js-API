const RefreshToken = require("../../models/RefreshToken");
const User = require("../../models/users");
const CustomErrorhandler = require("../../services/CustomErrorHandler");
const JwtService = require("../../services/JwtService");
require('dotenv').config();
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const Joi = require("joi");

const refreshController={
   async refresh(req,res,next){

    const refreshSchema = Joi.object({
        refresh_token: Joi.string().required(),
        
     }) ;

     const {error} = refreshSchema.validate(req.body);

     if(error){
        return next(error);
     }

      try {
        const refreshToken = await RefreshToken.findOne({token:req.body.refresh_token}) 
        if(!refreshToken){
            return next(CustomErrorhandler.unAuthorized('Invalid refresh token'))
        }
         let userId;
        try {
            const {_id} = await JwtService.verify(refreshToken.token,REFRESH_TOKEN,);
            userId=_id;
        } catch (error) {
            return next(CustomErrorhandler.unAuthorized('Invalid refresh token'))
        }

        const user = await User.findOne({_id : userId})
        if(!user){
            return next(CustomErrorhandler.unAuthorized('No user found'))
        }
        const access_Token = JwtService.sign({ _id: user._id, role: user.role })
        const refresh_Token = JwtService.sign({ _id: user._id, role: user.role },'1y',REFRESH_TOKEN);

            await RefreshToken.create({token : refresh_Token })

        res.json({access_Token,refresh_Token });


      } catch (err) {

        return next(new Error('something went wrong'+err.message))
        
      }

   }
}
module.exports = refreshController;