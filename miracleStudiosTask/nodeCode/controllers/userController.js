'use strict';
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const passwordHash = require('password-hash'); //hash password forpassword encryption
const moment = require('moment');
const passport = require('passport'); // require passport module
const users = require('../models').user; // require model users
const refLoginResponse = require('../helper/login_res_json.js'); //json login res to send
const LocalStrategy = require('passport-local').Strategy; //require the strategy that we want to use
const config = require('../config/config.json');
const fs = require("fs");
const csv = require("fast-csv");

class User {
	//method for simple login using passport module
	passportLogin(req, res, next) {
		try {
			passport.authenticate('local', async (err, adminUser, info) => {
				if (err) { //if any error occur
					return Promise.reject(err);
				}
				if (!adminUser) //if user not found (incorrect usernmae or password)
					return res.status(400).send({ message: info.message, status: 0 });
				else {
						//generate token
						let token = jwt.sign({ id: adminUser.id }, config.secret, {});
						adminUser = JSON.parse(JSON.stringify(adminUser));
						adminUser.token = token;
						let objLoginResponse = new refLoginResponse(adminUser);
						let response = objLoginResponse.data;
						res.status(200).send({ status: 1,message: "login successfully", data: response });	
				}
			})(req, res, next);
		} catch (err) {
			console.log(err);
			res.status(400).send({status: 0,message: err.message });
		}
	}


		//Method  for get single user
		async getSingleUserData(query) {
			try {
				let response = await users.findOne({ where: [{ id: query.userId, is_deleted: 0,type:1}] ,attributes: ["id", "firstName", "lastName", "email", "createdAt"]});
				let data= {};
				if (response) {
					data=response;
				}
				return Promise.resolve({ status: 1,message: "success", data: data });
			} catch (err) {
				console.log(err);
				return Promise.reject(err);
			}
	}

	//Method  for get all user
	async getAllUserData(query) {
			try {
				let response = await users.findAll({ where: [{is_deleted: 0,type:1}],order: [
                    ['createdAt', 'DESC']
                ],attributes: ["id", "firstName", "lastName", "email", "createdAt"] });
				let data= [];
				if (response.length>0) {
					data=response;
				}
				return Promise.resolve({ status: 1,message: "success", data: data });
			} catch (err) {
				console.log(err);
				return Promise.reject(err);
			}
	}

	
	//Method for update admin user 
	async updateAdminProfile(body, decoded) {
		try {
			let adminJson = {
				firstName: body.firstName,
				lastName: body.lastName
			}
			await users.update(adminJson, { where: { id: decoded } });
			let data = await users.findOne({ where: [{ id: decoded, is_deleted: 0 }],  attributes: ["id", "firstName", "lastName", "email", "createdAt"] });
			return Promise.resolve({ status: 1, message: "successfully updated admin profile",data:data });	
		} catch (err) {
			console.log(err);
			return Promise.reject(err);
		}
	}


	//method to check whether  email exist or not
	async checkEmail(email) {
		try {
			email = email.toLowerCase().trim();
			//check if email already exist
			let check_email = await users.findOne({ where: [{ email: email, is_deleted: 0 }] });
			if (check_email) {
				if (check_email.is_deleted == 0) {
					return { status: 0, message: "This email has already exist" };
				} else {
					return null;
				}
			}
		} catch (err) {
			console.log(err);
			return (err);
		}
	}

	//method  for create user
	async createUser(body) {
			try {
				if (body.email && body.email != "") {
					body.email = body.email.toLowerCase().trim();
				}
				//check if email exist or not
				let emailExist = await this.checkEmail(body.email);
				if (emailExist) {
					return Promise.reject(emailExist);
				}
				let userData = {
					firstName: body.firstName,
					lastName: body.lastName,
					email: body.email,
					password: passwordHash.generate(body.password),
					last_login: moment().utc().unix(),
				};
				//save user to db
				let save_user = await users.create(userData);
				if (save_user)
				{
					let objLoginResponse = new refLoginResponse(save_user);
					let response = objLoginResponse.data;
					return Promise.resolve({ status: 1,message: "user created successully.",  data: response });
				}
			} catch (err) {
				console.log(err);
				return Promise.reject(err);
			}
	}


	//Method for edit user
	async editUser(body,userId) {
		try {
			let checkUser = await users.findOne({ where: [{ id: userId, is_deleted: 0,type:1 }] });
			if(checkUser){
			let userJson = {
				firstName: body.firstName,
				lastName: body.lastName
			}
			await users.update(userJson, { where: { id: userId } });
			return Promise.resolve({ status: 1, message: "successfully updated user profile"});	
		}else{
			return Promise.resolve({ status: 0, message: "No user found of this id" });	
		}
		} catch (err) { 
			console.log(err);
			return Promise.reject(err);
		}
	}




	//Method for delete user
	async deleteUser(body) {
		try {
			let checkUser = await users.findOne({ where: [{ id: body.userId, is_deleted: 0,type:1 }] });
			if(checkUser){
			await users.update({is_deleted:1}, { where: { id: body.userId} });
			return Promise.resolve({ status: 1, message: "successfully deleted user" });	
			}else{
				return Promise.resolve({ status: 0, message: "No user found of this id" });	
			}
		} catch (err) { // catch errors
			console.log(err);
			return Promise.reject(err);
		}
	}

	//Method for upload Csv
	async csvUser(obj) {
		try {
			if (obj == undefined) {
				return Promise.resolve({ status: 0, message: "Please upload a CSV file!" });
			  }
			  let userData = [];
			  let path = "./public/upload/" + obj.filename;
			  fs.createReadStream(path)
			  .pipe(csv.parse({ headers: true }))
			  .on("error", (err) => {
				throw err.message;
			  }).on("data", (row) => {
				let jsonData={
					firstName: row.FirstName,
					lastName: row.LastName,
					email: row.Email,
					password: passwordHash.generate(row.Password),
				};
				userData.push(jsonData);
			  }).on("end",async () => {
				  for(let i=0;i<userData.length;i++){
					//check if email exist or not
				let emailExist = await this.checkEmail(userData[i].email);
				if (!emailExist) {
					await users.create(userData[i]); 
				}
				  }
				//    await users.bulkCreate(userData);
			  });
			  return Promise.resolve({ status: 1, message:  "file uploaded successfully: " + obj.originalname});
		} catch (err) { // catch errors
			console.log(err);
			return Promise.reject(err);
		}
	}
}


//Middleware for supplied strategy and their configuration
passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true }, // change default Field Names 
	async (req, email, password, done) => {
		try {
			email = email.toLowerCase().trim();
			let adminUser = await users.findOne({ where: [{ email: req.body.email, is_deleted: 0 ,type:2}] });
			if (!adminUser) {
				return done(null, false, { status: 0 ,message: "admin not found", });
			}
			//check the password is incorrect or correct by password hash module
			if (!passwordHash.verify(password, adminUser.password)) {
				return done(null, false, { status: 0 ,message: "password incorret" }); 
			}
			return done(null, adminUser, { status: 1,message: "success" });
		} catch (err) {
			return done(err);
		}
	}
));

module.exports = User;
