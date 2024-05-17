const Joi = require ('joi');
const CustomErrorhandler = require("../../services/CustomErrorHandler");
const User = require('../../models/users');
const bcrypt = require('bcrypt');
const JwtService = require('../../services/JwtService');
require('dotenv').config();
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const RefreshToken = require("../../models/RefreshToken")

const registerController = {
   async register(req, res, next) {
         const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password'),
         });

         console.log(req.body);
         const { error } = registerSchema.validate(req.body);
         if (error) {
            return next(error);
         }
         try {
            const exist = await User.exists({ email: req.body.email });
            if (exist) {
               return next(CustomErrorhandler.alreadyExist('This email already exists'));
            }
         } catch (err) {
            return next(err);
         }
         const { name, email, password } = req.body;
         const hashedPassword = await bcrypt.hash(password, 10);

         try {
            const newUser = new User({
               name,
               email,
               password: hashedPassword,
            });

            const result = await newUser.save(); 
            console.log(result)

            const access_Token = JwtService.sign({ _id: result._id, role: result.role });
            const refresh_Token = JwtService.sign({ _id: result._id, role: result.role },'1y',REFRESH_TOKEN);

            await RefreshToken.create({token : refresh_Token })

            res.json({ access_Token: access_Token, refresh_Token:refresh_Token });
         } catch (err) {
            return next(err);
         }
    }
};

module.exports = registerController;
