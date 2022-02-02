//load
const express=require('express');
const app=express();
const bcrypt=require('bcrypt');
const path=require('path');
const _=require('lodash');
const bodyparser=require('body-parser');//middleware
const urlencoded=bodyparser.urlencoded({ extended: false });
const mongoose=require('mongoose');
const {User,Post,Comment}=require("./Schemas/models");
const validate=require("./Schemas/validate");
const coo=require('cookie-parser');
app.use(coo());
require('dotenv').config();
const route2=require('./Routes/routes2');
const route1=require('./Routes/routes1');
//
mongoose.connect(process.env.mongo_url)
        .then(() => console.log('Connecteed to mongodb'))
        .catch((err) => console.log(err));

app.use(express.json());
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,'public')));
app.use('/',route1);
app.use('/logged',route2);

//routes

app.get("*",(req,res)=>
{
    res.send("page not found");
})
app.listen(process.env.PORT,()=>console.log(`connected to port ${process.env.PORT}`));