'use strict';
class UserValidator {
    //function to validate login request params
    login_email_validate(req, res, next) {
        req.check('email').notEmpty().withMessage('Please enter email').isLength({ max: 40 });
        req.check('password').notEmpty().withMessage('Please enter password').isLength({ max: 40 });
        // return req.validationErrors(true);
        let errors = req.validationErrors();
        if (!errors) {
            next();
        } else {
            res.status(400).send({  status: 0,message: "Validation Errors", errors: errors });
        }
    }

      //validator for create user
      createUser_validate(req, res, next) {
        req.check("firstName").notEmpty().withMessage('Please enter first name').isLength({ max: 100 });
        req.check("lastName").notEmpty().withMessage('Please enter last name').isLength({ max: 100 });
        req.check("email").notEmpty().withMessage('Please enter email').isLength({ max: 40 });
        req.check("password").notEmpty().withMessage('Please enter password');
        let errors = req.validationErrors();
        if (!errors) {
            next();
        } else {
            res.status(400).send({  status: 0,message: "Validation Errors", errors: errors });
        }
    }

      //validator for users
      checkUserId_validate(req, res, next) {
        req.check("userId").notEmpty().withMessage('Please enter user id');
        let errors = req.validationErrors();
        if (!errors) {
            next();
        } else {
            res.status(400).send({  status: 0,message: "Validation Errors", errors: errors });
        }
    }

}

module.exports = UserValidator;

