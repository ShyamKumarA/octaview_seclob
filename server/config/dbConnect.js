import mongoose from "mongoose";

const dbConnect=()=>{
    try{
        const conn=mongoose.connect("mongodb://localhost:27017/octaview");
        console.log("Database connected successfully");
    }catch(error){
        console.log("Database error");
    }
}

export default dbConnect