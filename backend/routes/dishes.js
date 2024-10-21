import express from 'express';
import dish from '../models/dishes.js';

export const dishRouter = express.Router();

dishRouter.post('/dishes/add',async(req,res)=>{
    try{
        const {CategoryName,name,img,options,description}= await req.body;
        const Dish = new dish({CategoryName,name,img,options,description});
        await Dish.save();
        return res.status(201).json({ status : 'success',Dish});
    }catch(error){
        console.log(error);
        return res.status(500).json(error.message);
    }
})

dishRouter.get('/dishes',async(req,res)=>{
    try{
        const alldishes = await dish.find({});
        return res.status(201).json({ status : 'success',data : alldishes}); 
    }catch(error){
        return res.status(401).json({ error : error.message});
    }
})


dishRouter.get('/dishes/:id',async(req,res)=>{
    try{
        const {id} =  req.params;
        const currdish = await dish.findById(id);
        if(currdish===null){
            return res.status(404).json('No dish found');
        }
        return res.status(200).json({ status : 'success',data : currdish}); 
    }catch(error){
        return res.status(401).json({ error : error.message});
    }
})
