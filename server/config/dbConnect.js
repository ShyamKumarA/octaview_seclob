import mongoose from "mongoose";

const dbConnect=()=>{
    try{
        const conn=mongoose.connect(process.env.MONGO);
        console.log("Database connected successfully");
    }catch(error){
        console.log("Database error");
    }
}

export default dbConnect