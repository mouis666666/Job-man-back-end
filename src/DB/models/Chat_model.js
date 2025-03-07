import mongoose from "mongoose";
import {  system_role } from "../../constants/constants.js";


const chat_schema = new mongoose.Schema({

    senderId : { type : mongoose.Schema.ObjectId , // must be HR or company owner) 
    require : true    
    },

    receiverId : { type : mongoose.Schema.ObjectId , // any user
        require : true ,
        enum : Object.values(system_role.USER)
    },

    messages : [{
        message : {
            type : String,
            minLength :[20 , " this description is  to short "],
            maxLength :[800 , " this description is  to long "]} ,
        senderId : mongoose.Schema.ObjectId
    }]
}, {timestamps :true} )



const chat_model =  mongoose.models.chats || mongoose.model("chats" , chat_schema )

export default chat_model