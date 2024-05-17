const User = require("../../models/user");
const CustomErrorhandler = require("../../services/CustomErrorHandler");

const userController ={

   async userDetails (req,res,next){
    try {
        const user = await User.findOne({_id:req.user._id}).select('-password -updatedAt -__v')
        if(!user){
            return next(CustomErrorhandler.notFound())
        }
        res.json(user)
    } catch (error) {
        return next(err);
    }
}

}

module.exports=userController;