import dotenv from "dotenv";
dotenv.config();

import express from 'express'
import userRouter from './routers/users.routers';
import mongoose from 'mongoose';
import categoryRouter  from './routers/category.router';
import subcategoryrouter from './routers/subcategory.router';
import brandrouter from './routers/brand.router';
import productrouter from './routers/product.router';


const port = 8001;

const app = express();
app.use(express.json());

app.use(express.static(__dirname)); // Photo static

app.get('/',(req,res)=>{
  res.send("Server")
})
// var a = "Hello World";
// console.log(a);

app.listen(port,()=>{
    console.log(`port is running on ${port}`)
})

mongoose.connect('mongodb://127.0.0.1:27017/silu-project')
.then(()=>console.log("connected"))
.catch(err=>console.log(err))


app.use('/user',userRouter)
app.use('/categories',categoryRouter)
app.use('/subcategories',subcategoryrouter)
app.use('/brands',brandrouter)
app.use('/products',productrouter)



// mongoose.connect('mongodb:127.0.0.1:')