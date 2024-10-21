import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    CategoryName:{
        type:String,
    }
});

const category = mongoose.model('category',categorySchema);

export default category;
