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
const auth=require("../middleware/auth");
require('dotenv').config();
route.get('/explore',auth,async(req,res)=>
{

const id=req.decoded;
const obj=await User.findById(id);
 try{

const posts=await Post.find({post_create:{$nin:[id]}}).populate("post_create","username");
console.log(posts);

try
{
    res.render("explore",{posts:posts});
}
catch(ex)
{
    return res.send(ex);
}







 }
 catch(err)
 {
     return res.send(err);
 }






});
route.get("/create",auth,(req,res)=>
{
    res.render("create");
})
route.get("/e",async (req,res)=>
{
  const p= await Post.findById( "61f96b486f48f87e394e43e6"    );
  console.log(p.commentedby);
  const a= p.likedby.push("61f7a66233ec212b68905096");
   p.save();
  try{
  res.send("hi");
  }
  catch(ex)
  {
      console.log(ex);
  }
});
route.get("/f",async (req,res)=>
{
  const p=new Comment({
    "text":"Nice one",
  
    "user_commented":"61f809340e80bd2ba42f02ef" 
  });
  await p.save();
  try{
  res.send("hi");
  }
  catch(ex)
  {
      console.log(ex);
  }
});
route.get("/read/:id",[auth,urlencoded],async (req,res )=>
{
const post_id=req.params['id'];
const user_id=req.decoded;
const output=await Post.findById(post_id)
                                    .populate("post_create")
                                    .populate({path:"commentedby",populate:{path:"user_commented"}});
                                    
                                  try
                                  {
                            
                                        const check=output.likedby.includes(user_id);
let like=-1;

if(check)
{like=1;}
else
{
    like=0;
}
    return res.render("showpost",{output:output,liked:like});



                                  }
                                  catch(ex)
                                  {
                                      return res.send(ex);
                                  }

}

)


route.post("/posts/liked/:id",[auth,urlencoded],async (req,res )=>
{

const post_id=req.params['id'];
const user_id=req.decoded;
const chec=req.body.liked;

const x=parseInt(chec);

///do change in database
/////and redirect to above api
const output=await Post.findById(post_id)
                                    .populate("post_create")
                                    .populate({path:"commentedby",populate:{path:"user_commented"}});
                                    
                                    try
                                    {
                                      if(x)
                                      {
                                          output.likedby.push(user_id);
                                          output.likes++;
                                          await output.save();

                                      }
                                      else
                                      {
                                        const i=output.likedby.indexOf(user_id);
                                        if(i>-1)
                                            output.likedby.splice(i,1);
                                            output.likes--;
                                       await  output.save();
                                      }
    return res.redirect("/logged/read/"+post_id);



}
catch(e)
{
    return res.send("exc");

}

}

)

route.get("/user/:userid",async (req,res)=>

{
    
}


)









module.exports=route;