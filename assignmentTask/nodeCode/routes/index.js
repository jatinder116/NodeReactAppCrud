const express = require('express');
const router = express.Router();
const refUser = require("../controllers/userController");
const objUser = new refUser();
const refUserValidator = require("../validators/user-validator");
const objUserValidator = new refUserValidator();

//admin login ==============
router.post('/login',objUserValidator.login_email_validate, async(req, res, next) => {
  try{
      await objUser.passportLogin(req, res, next);
  }catch(err){
    res.status(400).send({  status: 0,message: err.message });
  }
});


module.exports = router;