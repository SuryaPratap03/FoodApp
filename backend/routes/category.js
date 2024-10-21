import express from 'express';
import category from '../models/category.js';
 
const router = express.Router();

router.post('/category',async(req,res)=>{
    try{
        const categories = req.body;
        if(!Array.isArray(categories)){
            return res.status(400).json('not valid format');
        }
        const response = await category.insertMany(categories);
        return res.status(200).json({ status : 'success',response});
    }catch(error){
        return res.status(500).json(error.message);
    }
})

export default router;