import aj from "../lib/arcjet.js";
import {isSpoofedBot} from "@arcjet/inspect";

export const arcjetProtection=async(req,res,next)=>{
    try {
        const decision=await aj.protect(req);

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({message:"Too many requests, please try again later"});
            }
        else if(decision.reason.isBot()){
            return res.status(403).json({message:"Access denied, bot detected"});

        }else{
            return res.status(403).json({message:"Access denied, suspicious activity detected"});
        }
       }
       //check for spoofed bots
       if(decision.results.some(isSpoofedBot)){
        return res.status(403).json({
            error:"Spoofed bot detected",
            message:"Malicious bot activity detected and blocked"});
       }
       next();
    } catch (error) {
        console.error("Error in Arcjet protection middleware:", error);
        next();
    }
}