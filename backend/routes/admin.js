import express from 'express';
import  {VerifyToken}  from '../jsonwebtoken/VerifyToken.js';
import User from '../models/User.js';
import dish from '../models/dishes.js';

const router = express.Router();

//deleting an existing user
router.post('/deleteuser/:id',VerifyToken,async(req,res)=>{
    try{
        const user = await req.user;
        const curruser = await User.findById(user.id);
        if(!curruser){
            return res.status(404).json({ message :'Login and Signup First'});
        }
        if(curruser.role!=='admin'){
            return res.status(400).json({ message :'You are not authorised For this Action'});
        }
        const {id} = await req.params;
        const deleteduser = await User.findByIdAndDelete(id);
        if(!deleteduser){
            return res.status(404).json({ message :'No User Found'});
        }
        return res.status(200).json({ message :'User Deleted Successfully By Admin',user : deleteduser});
    }catch(error){
        return res.status(500).json({ error : error.message});
    }
})

//editing a Dish
router.put('/editDish/:id',VerifyToken,async(req,res)=>{
    try{
        const user =  req.user;
        const curruser =  await User.findById(user.id);
        if(!curruser){
            return res.status(404).json({ message : 'Not Authorised to perform this action'});
        }
        if(curruser.role!=='admin'){
            return res.status(403).json({ message : 'Not Authorised to perform this action'});
        }
        const {id} =   req.params;
        const Dish =  await dish.findById(id);
        if(!Dish){
            return res.status(404).json({message : 'Dish Not Found'});
        }
        const body = await req.body;
        const editedDish = await dish.findByIdAndUpdate(Dish._id,{$set:body},{new:true,runValidators:true});
        if(!editedDish){
            return res.status(400).json({ message : 'Dish Not Found'});
        }
        return res.status(200).json({ message : 'Dish Updated Successfully',dish : editedDish});
    }catch(error){
        return res.status(200).json({error : error});
    }
})

//Deleting a Dish 
router.delete('/deleteDish/:id',VerifyToken,async(req,res)=>{
    try{
        const user =  req.user;
        const curruser =  await User.findById(user.id);
        if(!curruser){
            return res.status(404).json({ message : 'Not Authorised to perform this action'});
        }
        if(curruser.role!=='admin'){
            return res.status(403).json({ message : 'Not Authorised to perform this action'});
        }
        const {id} =   req.params;
        const Dish =  await dish.findById(id);
        if(!Dish){
            return res.status(404).json({message : 'Dish Not Found'});
        }
        
        const editedDish = await dish.findByIdAndDelete(Dish._id,{new:true,runValidators:true});
        if(!editedDish){
            return res.status(400).json({ message : 'Dish Not Found'});
        }
        return res.status(200).json({ message : 'Dish Deleted Successfully',dish : editedDish});
    }catch(error){
        return res.status(200).json({error : error});
    }
})



export default router;