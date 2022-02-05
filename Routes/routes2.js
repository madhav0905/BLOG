const express=require('express');
const route=express.Router();
const bcrypt=require('bcrypt');
const path=require('path');
const jwt=require('jsonwebtoken');
const _=require('lodash');
const moment=require('moment');
const bodyparser=require('body-parser');//middleware
const urlencoded=bodyparser.urlencoded({ extended: false });
const mongoose=require('mongoose');
const {User,Post,Comment}=require("../Schemas/models");
const validate=require("../Schemas/validate");
const validatelogin=require("../Schemas/validatelogin");
const validatepost=require("../Schemas/validate_post");
const validateedit=require("../Schemas/validate_edit");
const validateedituser=require("../Schemas/validate_edit_user");
const auth=require("../middleware/auth");
const { url } = require('inspector');
require('dotenv').config();
route.get('/explore',[auth,urlencoded],async(req,res)=>
{
const id=req.decoded;
const obj=await User.findById(id);
    let patte=req.query.search;
   if(typeof(patte) === 'undefined')
        {
            patte="";
        }
try{
    let posts={};
    if(patte)
            { posts=await Post.find({post_create:{$nin:[id]},tags:new RegExp(patte.trim(), "i")}).populate("post_create","username");
 }
 else
 {
     posts=await Post.find({post_create:{$nin:[id]}}).populate("post_create","username"); 
 }
try
{
    res.render("explore",{posts:posts,pate:patte});
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
    var patte="";
    res.render("create",{pate:patte});
})
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
var patte="";
    return res.render("showpost",{output:output,liked:like,pate:patte});
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
route.get("/user/:userid",[auth,urlencoded],async (req,res)=>
{
const find_user=req.params["userid"];
let patt=req.query.search;
if(typeof(patt) === 'undefined')
     {
         patt="";
     }
try
{
    let post={};
    const userd=await User.find({username:find_user})
const se= userd;
console.log("se"+se);
if(patt)
{ post=await Post.find({"post_create":se,tags:new RegExp(patt.trim(), "i")}).populate("post_create","username");
}
else
{
post=await Post.find({"post_create":se}).populate("post_create","username"); 
}
return res.render("show_user",{user_de:se,posts:post,pate:patt});
}
catch(ex)
{
return res.send(ex);
}
}
);
route.post("/create/new",[auth,urlencoded],async (req,res)=>
{
const a=validatepost(req.body);
if(req.body.post_body.trim().length < 10)
    {
        return res.send("content should be atleast 10 characters");
    }
if(a.error)
{
    return res.send(a.error.details[0].message);
}
const user_id=req.decoded;
//create a post with user_id 
//split tags 
const arr=req.body.tags.split(/\s+/);
const obj=new Post({
"posttitle":req.body.posttitle,
"tags":arr,
"post_body":req.body.post_body.trim(),
"post_create":user_id
});
try
{
    const user_obj=await User.findById(user_id);
const resul=await obj.save();
 user_obj.posted.push(resul._id);
await user_obj.save();
return res.redirect("/logged/explore");
}
catch(ex)
{
    return res.send("server down pls try again");
}
}
)
route.get("/yourposts",[auth,urlencoded],async (req,res) =>
{
    let patt=req.query.search;
if(typeof(patt) === 'undefined')
     {
         patt="";
     }
const userid=req.decoded;
let up={};
 up=await User.findById(userid).populate("posted");
 let post={};
const k={};
if(patt)
{ post=await Post.find({"post_create":up,tags:new RegExp(patt.trim(), "i")}).populate("post_create","username");
}
else
{
post=await Post.find({"post_create":up}).populate("post_create","username"); 
}
try{
    return res.render("user_posts",{posts:post,pate:patt});
}
catch(err)
{
    return res.send(err);
}
}
);
route.get("/logout",auth,(req,res)=>
{
    res.cookie("access_token", "", { expires: new Date(0),domain:'localhost', path: '/' });
 res.redirect("/");
}
)
route.get("/edit/:id",[auth,urlencoded],async (req,res)=>
{
    const post_id=req.params['id'];
    const user_id=req.decoded;
    const output=await Post.findById(post_id)
                                        .populate("post_create")
                                        .populate({path:"commentedby",populate:{path:"user_commented"}});
                                      try
                                      {var p="";
                                            return res.render("edit_post",{out:output,pate:p});
                                      }
                                      catch(ex)
                                      {
                                          return res.send(ex);
                                      }
}
)
route.post("/edit/new",[auth,urlencoded],async (req,res)=>
{
    const a=validateedit(req.body);
if(req.body.post_body.trim().length < 10)
    {
        return res.send("content should be atleast 10 characters");
    }
if(a.error)
{
    return res.send(a.error.details[0].message);
}
const user_id=req.decoded;
const po_id=req.body.pid;
//create a post with user_id 
//split tags 
req.body.tags.trim();
const arr=req.body.tags.split(/\s+/);
const dat={
"posttitle":req.body.posttitle.trim(),
"tags":arr,
"post_body":req.body.post_body.trim(),
"date":moment().format('MMMM Do YYYY, h:mm:ss a'),
}
try
{
    const obj=await Post.findByIdAndUpdate(po_id,dat);
return res.redirect("/logged/yourposts");
}
catch(ex)
{
    return res.send("server down pls try again");
}
}
);
route.get("/your_profile",[auth,urlencoded],async (req,res)=>
{
const user_id=req.decoded;
const obj=await User.findById(user_id);
try
{
    var p="";
    return res.render("your_profile",{ob:obj,pate:p});
}
catch(er)
{
    return res.send(er);
}
}
);
route.post("/edit/profile",[auth,urlencoded],async (req,res)=>
{
    req.body.username.trim();
    console.log(req.body);
    const check=validateedituser(req.body);
    if(check.error)
    {console.log(check.error)
    return res.send(check.error.details[0].message);
    }
    const em=_.pick(req.body,["username"]);
    const user=_.pick(req.body,['first_name','bio']);
    const us=await User.findByIdAndUpdate(req.body.uid,user,{ returnOriginal: false});
    try
    {
console.log(us);
return res.redirect("/logged/your_profile");
    } 
    catch(er)
    {
        return res.send(er);
    }
});
module.exports=route;