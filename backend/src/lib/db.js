//alow us to connect our database
import mongoose from "mongoose";
export const connectDB=async()=>{
    try {
        const{MONGO_URL}=process.env;
        if(!MONGO_URL){
            throw new Error("MONGO_URL is not defined in environment variables");
        }
        const conn=await mongoose.connect(process.env.MONGO_URL)
        console.log("MONGODB CONNECTED:",conn.connection.host);
    } catch (error) {
       console.error("Error connecting to MONGODB:",error);
        process.exit(1); // 1 status code=failed connection,0=success
    }
}