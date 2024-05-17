const express = require("express")
const router = express.Router();
const registerController= require("../controllers/auth/registerController")
const loginController = require("..//controllers/auth/loginController")
const userController = require ("../controllers/auth/userController.js")
const auth = require("..//middleware/auth");
const refreshController = require("..//controllers/auth/refreshController.js")
const paymentController=require("../controllers//auth/paymentController.js")

router.post('/register',registerController.register);
router.post('/login',loginController.login);
router.get('/userDetails',auth,userController.userDetails);
router.post('/refresh',refreshController.refresh);
router.post('/payment', paymentController.makePayment);


module.exports= router;