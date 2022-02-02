const jwt=require('jsonwebtoken');

module.exports=function auth(req,res,next)
{

const t=req.cookies.access_token;

if(!t) return res.status(401).send("access denied");
const dec=jwt.verify(t,process.env.secret);
req.decoded=dec._id;
next();

}
