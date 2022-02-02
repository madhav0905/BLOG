const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.mongo_url)
        .then(() => console.log('Connecteed to mongodb'))
        .catch((err) => console.log(err));  
        const commentschema=new mongoose.Schema(
            {
                text:
                {
            type:String,
            required:true,
            minlength:5,
                    maxlength:30
            
                },
                user_commented:
                {
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"user",
                    
        
                }
         
            
            }
            
            );
        
        const userschema=new mongoose.Schema(
            {
                username:
                {
            type:String,
            required:true,
            minlength:5,
            unique:true
            
                },
                password:
                {
                    type:String,
                    required:true,
                    minlength:5
            
                },
                first_name:
                {
                    type:String,
                    required:true,
                    minlength:3,
                    trim:true
                },
                bio:
                {
                    type:String,
                    required:true,
                    trim:true,
                    minlength:5
            
                },
                posted:[{type:mongoose.Schema.Types.ObjectId,default:[],ref:"post"}],
                liked:[{type:mongoose.Schema.Types.ObjectId,default:[],ref:"post"}],
            
               
            
            }
            
            );
          

        












const postschema=new mongoose.Schema(
    {
        posttitle:
        {
    type:String,
    required:true,
    minlength:5,

    
        },
        tags:
        {
            type:[String],
            required:true,
          
    
        },
        post_body:
        {
            type:String,
            required:true,
            minlength:10,
            maxlength:400,
            trim:true
        },
        post_create:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
       
            
          
    
        },
        
        likedby:[{type:mongoose.Schema.Types.ObjectId,default:[],ref:"user"}],
        likes:{type:'Number' ,default:0},
        commentedby:[{type:mongoose.Schema.Types.ObjectId,default:[],ref:"comment"}],
    
    }
    
    );
    const Post=mongoose.model('post',postschema);
    const Comment=mongoose.model('comment',commentschema);
    const User=mongoose.model('user',userschema);
    module.exports.User=User;

    module.exports.Comment=Comment;
    module.exports.Post=Post;