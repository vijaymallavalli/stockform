import express from "express";
const app =express()


import cors from 'cors'

import cookieParser from "cookie-parser";

// importing routes 
import authRoute from './routes/auth.js'
import userRoute from './routes/users.js'
import productRoute from "./routes/products.js"

app.use((req,res,next) =>{
    res.header("Access-Control-Allow-Credentials",true)
    next()
})

app.use(express.json())
app.use(cors({
    origin:"http://localhost:3000",
}))
app.use(cookieParser())


app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/products",productRoute)


app.listen(8800,(req,res)=>{
    console.log('hello server .....................')
})
