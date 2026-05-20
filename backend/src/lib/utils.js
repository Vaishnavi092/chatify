import jwt from "jsonwebtoken";
export const generateToken=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000, //7 days in milliseconds
        httpOnly:true, //cookie cannot be accessed by client-side JavaScript,cross-site scripting (XSS) protection
        secure:process.env.NODE_ENV==="development"?false:true, //cookie sent only over HTTPS in development
        sameSite:"strict" //cookie sent only for same-site requests-CSRF attacks
    })
    return token;
}