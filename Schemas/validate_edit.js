const Joi=require('joi');
Joi.objectId = require('joi-objectid')(Joi)


module.exports=function(ms)
{
    const schema=Joi.object(
        {
            posttitle:Joi.string().min(5).required().trim(),
            tags:Joi.string().min(3).required().trim(),
            post_body:Joi.string().required().min(10).max(400).trim(),
            pid:Joi.objectId()
        });
        return schema.validate(ms);

}