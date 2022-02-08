const Joi=require('joi');



module.exports=function(ms)
{
    const schema=Joi.object(
        {
      
            curr_password:Joi.string().min(5).required(),
            new_password:Joi.string().min(5).required(),
            retype_new_password:Joi.string().min(5).required()
        });
        return schema.validate(ms);

}