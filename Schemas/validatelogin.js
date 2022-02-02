const Joi=require('joi');



module.exports=function(ms)
{
    const schema=Joi.object(
        {
            username:Joi.string().min(5).required().email(),
            password:Joi.string().min(5).required(),
        });
        return schema.validate(ms);

}