const Joi=require('joi');



module.exports=function(ms)
{
    const schema=Joi.object(
        {
            posttitle:Joi.string().min(5).required(),
            tags:Joi.string().min(3).required(),
            post_body:Joi.string().required().min(10).max(400)
        });
        return schema.validate(ms);

}