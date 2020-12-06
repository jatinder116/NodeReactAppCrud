var express = require('express');
var router = express.Router();
const refUser = require("../controllers/userController");
const objUser = new refUser();
const refUserValidator = require("../validators/user-validator");
const objUserValidator = new refUserValidator();
const upload = require("../helper/uploadCsv");

// GET Single user
router.get('/singleUser',objUserValidator.checkUserId_validate, async(req, res, next) => {
  try{
  let result = await objUser.getSingleUserData(req.query);
  res.status(200).send(result);
}catch(err) {
    res.status(400).send({status: 0,message: err.message });
  };
});

//Get All user
router.get('/allUsers',  async(req, res, next) => {
  try{
  let result = await objUser.getAllUserData();
  res.status(200).send(result);
}catch(err) {
  res.status(400).send({status: 0,message: err.message });
  };
});

//update admin profile
router.put('/editAdmin', async(req, res, next) => {
  try{
  let result = await objUser.updateAdminProfile(req.body, req.decoded.id)
  res.status(200).send(result);
}catch(err) {
  res.status(400).send({status: 0,message: err.message });
  };
});


//create user
router.post('/createUser', objUserValidator.createUser_validate,async(req, res, next) => {
  try{
  let result = await objUser.createUser(req.body);
  res.status(200).send(result);
}catch(err) {
  res.status(400).send({status: 0,message: err.message });
  };
});


//update user
router.put('/editUser',objUserValidator.checkUserId_validate, async(req, res, next) => {
  try{
  let result = await objUser.editUser(req.body,req.body.userId);
  res.status(200).send(result);
}catch(err){
  res.status(400).send({status: 0,message: err.message });
  };
});

//delete user
router.post('/deleteUser', objUserValidator.checkUserId_validate ,async(req, res, next) => {
  try{
  let result = await objUser.deleteUser(req.body);
  res.status(200).send(result);
}catch(err) {
  res.status(400).send({status: 0,message: err.message });
  };
});


//upload CSV file 
router.post('/csvUser',upload.single("file"),async(req, res, next) => {
  try{

    console.log("file======",req.file);
    let result = await objUser.csvUser(req.file);
   res.status(200).send(result);
}catch(err) {
  res.status(400).send({status: 0,message: err.message });
  };
});

module.exports = router;
