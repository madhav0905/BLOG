const express=require('express');
const route=express.Router();
const bcrypt=require('bcrypt');
const path=require('path');
const jwt=require('jsonwebtoken');
const _=require('lodash');
const bodyparser=require('body-parser');//middleware
const urlencoded=bodyparser.urlencoded({ extended: false });
const mongoose=require('mongoose');
const {User,Post,Comment}=require("../Schemas/models");
const validate=require("../Schemas/validate");
const validatelogin=require("../Schemas/validatelogin");
require('dotenv').config();

route.get("/",(req,res)=>
{
    res.render("login");
}
);
route.get("/register",(req,res)=> 
{
    
    res.render("register");
}
);
route.post("/store",urlencoded,async (req,res)=>
{
const check=validate(req.body);
if(check.error)
{
return res.send(check.error.details[0].message);
}
const em=_.pick(req.body,["username"]);
const user=_.pick(req.body,['username','password','first_name','bio']);

const us=await User.find({username:em.username});

if(us.length)
{

   return res.send(" user already exist");
  
}

const salt=await bcrypt.genSalt(10);
const hashed= await bcrypt.hash(user.password,salt);

try{
user.password=hashed;
}
catch(err)
{
res.send(err.message);
}



const ob=new User(user);
await ob.save()
        .then(()=>res.redirect('/')        )
        .catch((err)=>{console.log(err);return res.send("technical error")})



}

);
route.post("/logg",urlencoded,async (req,res)=>
{
    const check=validatelogin(req.body);
if(check.error)
{
return res.send(check.error.details[0].message);
}
const pass=req.body.password;
try{
const result=await User.find({username:req.body.username});
const user=result[0];
if(result.length)
{
    await  bcrypt.compare(pass, user.password, function(err, result) {
        // result == true
            if(err)
                return res.status(400);
            if(!result)
            return res.status(400).send('wrong password');

            
     const token=jwt.sign({_id:user._id},process.env.secret);

     
                res.cookie("access_token", token, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  
                });

                res.redirect("/logged/explore");


    });
}
else
{
    return res.send("no account exists");
}

}
catch(ex)
{
    return res.send(ex);
}



}
);
module.exports=route;