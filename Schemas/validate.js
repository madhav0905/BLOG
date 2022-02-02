const Joi=require('joi');



module.exports=function(ms)
{
    const schema=Joi.object(
        {
            username:Joi.string().min(5).required().email(),
            password:Joi.string().min(5).required(),
        first_name:Joi.string().min(3).required(),
            bio:Joi.string().required().min(5)
        });
        return schema.validate(ms);

}