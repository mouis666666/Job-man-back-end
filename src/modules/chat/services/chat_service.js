
import { authentication_middleware } from "../../../middlewares/auth_middleware.js"
import { socketConnections } from "../../../utils/socket.utils.js"
import chat_model from './../../../DB/models/Chat_model';



/**
 * 1. get chat history with specific user

## Using [Socket.IO](http://Socket.IO) (Events)

1. Send real-time messages between hr and user
    1. only hr or company owner can kick off this conversation with regular user then regular user can reply to it
 * */ 

export const GetChatHistoryService = async (req, res, next) => {
    const {_id} = req.loggedInUser
    const {receiverId} = req.params

    const chat = await chat_model.findOne({
        $or:[
             {senderId:_id, receiverId},
            {senderId:receiverId, receiverId:_id}
        ]
    }).populate(
        [
            {path:'senderId' , select:'username'},
            {path:'receiverId' , select:'username'},
            {path:'messages.senderId' , select:'username'}
         ]
    )

    return res.status(200).json({ message: 'Chat history fetched successfully'  , chat})
}



export const SendeChatMessage = async (socket)=>{
    return socket.on('sendMessage', async (data)=>{
        const {_id} = await authentication_middleware(socket.handshake.auth.accesstoken) 
        const {body, receiverId} = data  

        let chat = await chat_model.findOneAndUpdate({
            $or:[
                {senderId:_id, receiverId},
               { senderId:receiverId, receiverId:_id}
           ]
        },{
            $addToSet:{
                messages:{
                    body,
                    senderId:_id
                }
            }
        }
        )

        if(!chat) {
            const newChat= new chat_model({
                senderId:_id,
                receiverId,
                messages:[{
                    body,
                    senderId:_id
                }]
            })
            chat =  await newChat.save()
        }

        socket.emit('successMessage', {body , chat})

        const socketId = socketConnections.get(receiverId.toString())
        socket.to(socketId).emit('receiveMessage', {body})
    })
}