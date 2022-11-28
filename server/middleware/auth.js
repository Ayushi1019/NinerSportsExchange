const Equipments = require('../models/equipments');

exports.isLoggedIn = (req,res,next)=>{
    let token = req.headers["authorization"];
    console.log(token)
	if(token){
        next();
    }
    else{
        res.send({'status':401,'message': 'Unauthorized'})
    }
};

exports.isOwner = (req,res,next)=>{
    let id = req.params.id;
    let headers = req.headers["authorization"]
    Equipments.findById(id)
    .then(equipments=>{
        if(equipments && headers){
            if(equipments.owner == token.split(" ")[1]){
                next();
            }
            else{
                res.send({'status':400,'message':'Unauthorized to access to the Resource'});
            }
        }

    })
    .catch(err=>next(err));
};