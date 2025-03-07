

import  { Router} from 'express'
import * as Chat_Service from './services/chat_service.js'
import { authentication_middleware } from '../../middlewares/auth_middleware.js';
import { error_handler_middleware } from '../../middlewares/error_handler_middleware.js';

const chat_Controller = Router()



chat_Controller.get(
    '/get-chat-history/:receiverId',
    authentication_middleware(),
    error_handler_middleware(Chat_Service.GetChatHistoryService)
)

chat_Controller.post(
    '/Send_Chat_Message/:receiverId',
    authentication_middleware(),
    error_handler_middleware(Chat_Service.SendeChatMessage)
)
export  default chat_Controller

