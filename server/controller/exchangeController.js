const model = require('../models/equipments.js');
const user = require('../models/user.js');
const Exchange = require('../models/exchange');

const mongoose = require('mongoose');

exports.index = (req, res,next)=>{
    model.find()
    .then((equipments)=>
        res.send({"status":200,"data":{"equipments": equipments}})
    )
    .catch(err=>next(err));
};


exports.show = (req, res, next)=>{
    let id = req.params.id;
    Promise.all(model.findById(id).populate('owner','firstName lastName'))
    .then((results)=>{
        const equipment = results;
        if(equipment) {
            res.send({"status":200,"data":equipment})
        } 
        else {
            res.send({"status":400,"message":"Cannot find equipment with id"+id})
        }
    })
    .catch(err=>next(err));

};

exports.create = (req, res,next)=>{
    console.log("create")

    let newEquipment = new model(req.body);
    newEquipment.owner = req.query.id;
    newEquipment.status = "Available";
    newEquipment.exchanges = null;
    newEquipment.save()
    .then((newEquipment)=>{
        res.send({"status":200,"data":newEquipment})
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            res.send({'status': 400,'error': err.name})
        }
        next(err);
    });    
};


exports.delete = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then((equipment)=>{
        if(equipment){
            if(equipment.exchanges !=null){
                Exchange.findById(equipment.exchanges).populate('equipment1').populate('equipment2')
                .then((exchange)=>{    
                    if(id == exchange.equipment1._id){
                        Promise.all([model.findById(exchange.equipment2._id),model.findByIdAndDelete(id,{useFindAndModify: false})])
                        .then((results)=>{
                            const [equipment2,equipment] = results;
                            equipment2.status= "Available";
                            equipment2.exchanges = null;
                            equipment2.save();
                            res.send({"status":200,"message":"You have successfully deleted equipment"})
                        })
                        .catch(err=>next(err));
                    } 
                    else{
                        Promise.all([model.findById(exchange.equipment1._id),model.findByIdAndDelete(id,{useFindAndModify: false})])
                        .then((results)=>{
                            const [equipment1,equipment] = results;
                            equipment1.status= "Available";
                            equipment1.exchanges = null;
                            equipment1.save();
                            res.send({"status":200,"message":"You have successfully deleted equipment"})
                        })
                        .catch(err=>next(err));
                    }
                })
                .catch(err=>next(err));
                
            }
            else{
                model.findByIdAndDelete(id,{useFindAndModify: false})
                .then((equipment)=>{
                    res.send({"status":200,"message":"You have successfully deleted equipment"})
                })
                .catch(err=>next(err));
            }
        }
        else{
            res.send({"status":400,"message":"Cannot find equipment with id"+id})
        }
    })
    .catch(err=>next(err));
};


exports.update = (req, res, next)=>{
    let newEquipment = req.body;
    let id = req.params.id;


    model.findByIdAndUpdate(id,newEquipment,{useFindAndModify: false, runValidators: true})
    .then((newEquipment)=>{
        if(newEquipment) {
            res.send({"status":200,"message":"You have successfully updated equipment"})
        } 
        else {
            res.send({"status":400,"message":"Cannot find equipment with id"+id})
        }
    })
    .catch((err) =>{
        if(err.name === 'ValidationError'){
            console.log(err)
        }
        next(err);
    });
};

exports.watch = (req,res,next)=>{
    let user_id = req.params.user;
    let equipment_id = req.params.id;
    user.findOne({ _id: user_id })
    .then(user=>{
        if(user){
            let flag = 1;
            user.watchEquipments.forEach(equipment => {
                if(equipment == equipment_id){
                    flag = 0;
                    user.watchEquipments.pull(equipment_id);
                }
            });
            if(flag == 1){
                user.watchEquipments.push(equipment_id);
            }
            user.save();
        }
        else{
            console.log("User not found");
        }
    })
    .catch(err=>next(err));

    res.send({"status":200,"message":"You have watched/unwatched an equipment"})
};

exports.equipments = (req,res,next)=>{
    let user_id = req.params.id;
    model.find({owner:user_id})
    .then((equipments)=>{
        res.send({"status":200,"data":equipments})
    })
    .catch(err=>{
        next(err);
    });
};