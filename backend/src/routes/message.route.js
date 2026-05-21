import express from "express";
import { getAllContacts,getMessagesByUserId,sendMessage,getChatPartners } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
const router=express.Router();

router.use(arcjetProtection,protectRoute); // Apply authentication middleware to all message routes

//middleware will run in order they are defined, so arcjetProtection will run first to check for bot activity, and if it passes, 
// then protectRoute will check for authentication. This way we can prevent unnecessary
//  authentication checks for bots and save server resources.
router.get("/contacts",getAllContacts)
router.get("/chats",getChatPartners)
router.get("/:id",getMessagesByUserId)
router.post("/send/:id",sendMessage);

export default router;