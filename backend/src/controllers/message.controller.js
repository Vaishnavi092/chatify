import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
export const getAllContacts=async(req,res)=>{
    try {
        const loggedInUserId=req.user._id;
        //find all users except the logged in user
        const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getAllContacts controller:",error);
        res.status(500).json({message:error.message});
    }
}

export const getMessagesByUserId=async(req,res)=>{
    try {
        const myId=req.user._id;
        const {id:userToChatId}=req.params;

        const message=await Message.find({
            $or:[
                {sender:myId,receiverId:userToChatId},
                {sender:userToChatId,receiverId:myId}
            ],
        });
        res.status(200).json(message);
    } catch (error) {
        console.log("Error in getMessagesByUserId controller:",error);
        res.status(500).json({message:error.message});
    }
}

export const sendMessage=async(req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;
        let imageUrl;
        if(image){
            //upload image to cloudinary and get the url
            const uploadResponse= await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }

        const newMessage=new Message({
            sender:senderId,
            receiverId,
            text,
            image:imageUrl
        });
        await newMessage.save();
        //todo:send message in real time if user is online using socket.io
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller:",error);
        res.status(500).json({message:error.message});
    }
}

export const getChatPartners=async(req,res)=>{
    try {
        const loggedInUserId=req.user._id;
        //find all messages where logged in user is either sender or receiver
        const messages=await Message.find({
            $or:[
                {sender:loggedInUserId},
                {receiverId:loggedInUserId}
            ]
        });
        const chatPartnerIds=[...new Set(messages.map((msg)=>
            msg.senderId.toString()===loggedInUserId.toString()
            ?msg.receiverId.toString()
            :msg.senderId.toString()
        )
        ),
    ];

     const chatPartners=await User.find({_id:{$in:chatPartnerIds}}).select("-password");
     res.status(200).json(chatPartners);   
    } catch (error) {
        console.log("Error in getChatPartners controller:",error);
        res.status(500).json({message:error.message});
    }
}