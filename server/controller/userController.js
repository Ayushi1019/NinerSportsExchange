const model = require('../models/user');
const Equipments = require('../models/equipments');
const Exchange = require('../models/exchange');
var jwt = require('jsonwebtoken');
const config = require('../config')

exports.create = (req, res, next)=>{
    let user = new model(req.body);
    user.save()
    .then(data=> {
        return res.send({'status': 200, 'message' : 'User added!','data':data})
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            return res.send({'message':err.message})
        }

        if(err.code === 11000) {
            return res.send({'message':'Email has been used'})
        }
    });     
};


exports.login = (req, res, next)=>{
    let email = req.body.email;
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            console.log('wrong email address');
             
            return res.send({'status': 400, 'message' : 'Wrong Email Address!'})
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    var token = jwt.sign({id: email},config.secret,{
                        expiresIn : "2h"
                    })
                    user.token = token 

                    user.save().then((data)=>{
                        return res.send({'status': 200, 'message' : 'Logged in!',"data" : data})
                    })
                    
            } else {     
                res.send({'status': 400, 'message' : 'Wrong Password!'})
            }
            });     
        }     
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next)=>{ 
    let id = req.query.id

    Promise.all([model.findById(id).populate('watchEquipments'),Equipments.find({owner:id})]) 
    .then((results)=>{
        const [user,equipments] = results;
        const watchEquipments = user.watchEquipments;
        let exchangeEquipments=new Array();
        
        if(equipments.length==0){
            return res.send({'status':200,'data':{user,equipments,watchEquipments,exchangeEquipments}});
        }

        let exchangeableEquipments=new Array();
        equipments.forEach(equipment=>{
            if(equipment.exchanges!=null ){
                exchangeableEquipments.push(equipment.exchanges);
            }
        });

        let exchEquipments = new Array();
        exchangeableEquipments.forEach(equipment=>{
            var f1 = Exchange.findById(equipment).populate('equipment1').populate('equipment2').populate('owner')
            exchEquipments.push(f1);
        });
        Promise.all(exchEquipments)
        .then((result)=>{
            
            result.forEach(rr=>{
                if(rr){

                    exchangeEquipments.push(rr);
                }
            });
            return res.send({'status':200,'data':{user,equipments,watchEquipments,exchangeEquipments}});
        })
        .catch(err=>next(err));
    })
    .catch(err=>next(err));
};


exports.logout = (req, res, next)=>{
    let email = req.query.email
    console.log(email)
    model.findOne({ email: email }).then(user=>{
        user.token = "" 

        user.save().then((data)=>{
            return res.send({'status': 200, 'message' : 'Logged Out!'})
        })
    })
    .catch(err=>next(err))
 };

exports.exchange = (req, res, next)=>{
    let equipment1_id = req.body.equipment1_id;
    let equipment2_id = req.body.equipment2_id;
    let id = req.query.id
    
    let newExchange = new Exchange({equipment1:equipment1_id, equipment2:equipment2_id, owner:id});
    newExchange.save()
    .then((exchange)=>{
        if(exchange){
            let trade_id = exchange._id;

            Promise.all([Equipments.findById(equipment1_id),Equipments.findById(equipment2_id)])
            .then((result)=>{
                const [equipment1,equipment2] = result;
                equipment1.status = "Pending";
                equipment1.exchanges = trade_id;
                equipment1.save();
                equipment2.status = "Pending";
                equipment2.exchanges = trade_id;
                equipment2.save();
                res.send({'status':200,'data':{equipment1,equipment2}})
            })
            .catch(err=>next(err));
        }
    })
    .catch(err=>next(err));
};

exports.manageOffer = (req, res, next) =>{
    let trade_id = req.params.id;
    Exchange.findById(trade_id).populate('equipment1').populate('equipment2').populate('owner')
    .then((result)=>{
        let equipment1 = result.equipment1;
        let equipment2 = result.equipment2;
        let owner = result.owner;
        res.send({'status':200,'data':{equipment1, equipment2, owner,trade_id}});
    })
    .catch(err=>next(err));
};

exports.reject = (req, res, next) =>{
    let trade_id = req.params.id;
    Exchange.findById(trade_id).populate('equipment1').populate('equipment2').populate('owner')
    .then((result)=>{
        let equipment1_id = result.equipment1._id;
        let equipment2_id = result.equipment2._id;

        Promise.all([Equipments.findById(equipment1_id),Equipments.findById(equipment2_id)])
        .then((results)=>{
            const [equipment1,equipment2] = results;
            equipment1.status = "Available";
            equipment1.exchanges = null;
            equipment1.save();
            equipment2.status = "Available";
            equipment2.exchanges = null;
            equipment2.save();
            res.send({'status':200,'data':{equipment1,equipment2}})
        })
        .catch(err=>next(err));
    })
    .catch(err=>next(err));
};

exports.accept = (req, res, next) =>{
    let trade_id = req.params.id;
    Exchange.findById(trade_id).populate('equipment1').populate('equipment2').populate('owner')
    .then((result)=>{
        let equipment1_id = result.equipment1._id;
        let equipment2_id = result.equipment2._id;

        Promise.all([Equipments.findById(equipment1_id),Equipments.findById(equipment2_id)])
        .then((results)=>{
            const [equipment1,equipment2] = results;
            equipment1.status = "Traded";
            equipment1.exchanges = null;
            equipment1.save();
            equipment2.status = "Traded";
            equipment2.exchanges = null;
            equipment2.save();
            res.send({'status':200,'data':{equipment1,equipment2}})
        })
        .catch(err=>next(err));
    })
    .catch(err=>next(err));
};