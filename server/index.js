import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();


mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to mongoDB");
}).catch((err)=>{
    console.log(err);
})

const app=express()
const PORT=4001;
app.listen(PORT,()=>{
    console.log(`Server connected ${PORT}`);
})