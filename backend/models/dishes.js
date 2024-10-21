import mongoose from "mongoose";

const dishesSchema = new mongoose.Schema({
    CategoryName:{
        type :String,
        required:true,
    },
    name:{
        type:String,
    },
    img:{
        type:String,
    },
    options:[
        {
            half:{
                type:String,       
            },
            full:{
                type:String,       
            },
            regular:{
                type:String,       
            },
            medium:{
                type:String,       
            },
            large:{
                type:String,       
            },
        }
    ],
    description:{
        type : String,
        required:true
    }
});

const dish = mongoose.model('dish',dishesSchema);

export default dish;
