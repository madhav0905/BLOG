const Joi=require('joi');
Joi.objectId = require('joi-objectid')(Joi)





module.exports=function(ms)
{
    const schema=Joi.object(
        {
            username:Joi.string().min(5).required().email().trim(), 
        first_name:Joi.string().min(3).required(),
            bio:Joi.string().required().min(5),
            uid:Joi.objectId()
        });
        return schema.validate(ms);

}