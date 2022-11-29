const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateId = (req,res,next) =>{
	let id = req.params.id;
	if(!id.match(/^[0-9a-fA-F]{24}$/)) {
		res.send({"message":"Invalid id"})
    }
    else{
    	next();
    }
};

exports.validateIdByQuery = (req,res,next) =>{
	let id = req.query.id;
	if(!id.match(/^[0-9a-fA-F]{24}$/)) {
		res.send({"message":"Invalid id"})
    }
    else{
    	next();
    }
};

exports.validateSignIn = [
		body('email','Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
		body('password','Password must be at least 8 characters and at most 64 characters').isLength({min:8, max:64})
	];

exports.validateSignUp = [
		body('firstName','First Name can not be empty').notEmpty().trim().escape(),
		body('lastName','Last Name can not be empty').notEmpty().trim().escape(),
		body('email','Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
		body('password','Password must be at least 8 characters and at most 64 characters').isLength({min:8, max:64})
	];

exports.validateEquipment = [
		body('name','Equipment can not be empty').notEmpty().trim().escape(),
		body('category','Sport can not be empty').notEmpty().trim().escape(),
		body('content','Content must be of minimum 10 Characters').notEmpty().trim().escape(),
	];

exports.validateResults = (req,res,next)=>{
	let errors = validationResult(req);
	
	let errorMsg = []
    if(!errors.isEmpty()){
        errors.array().forEach(error=>{
			
			errorMsg.push({"key" : error.param,
				"error" : error.msg
			})
        });
        return res.send(errorMsg)
    }
    else{
    	return next();
    }
}