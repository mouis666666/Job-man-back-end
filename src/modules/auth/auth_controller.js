import  Router  from 'express';
import * as auth_service from "./services/auth_service.js"
import { error_handler_middleware } from './../../middlewares/error_handler_middleware.js';
// import { system_role } from "../../constants/constants.js";
// import {  authorization_middleware } from "../../middlewares/auth_middleware.js";
const auth_controller = Router()


// const { USER ,  ADMIN  }  = system_role

auth_controller.post( "/sign-up" , error_handler_middleware(auth_service.sign_up_service ) )
auth_controller.post( "/confirm_OTP" , error_handler_middleware(auth_service.confirm_OTP_service ) )
auth_controller.post("/sign-in" /*, authorization_middleware([USER ,ADMIN])*/ , error_handler_middleware(auth_service.sign_in_service) )
auth_controller.get("/verify/:verify_email_token" , error_handler_middleware(auth_service.verify_email_service) )
auth_controller.post("/refresh-token" , error_handler_middleware(auth_service.refresh_token_service) )
auth_controller.post("/gmail-signup" , error_handler_middleware(auth_service.sign_up_gmail_service) )
auth_controller.post("/gmail-login" ,error_handler_middleware(auth_service.sign_in_gmail_service) )
auth_controller.post("/sign-out" , error_handler_middleware(auth_service.sign_out_service) )
auth_controller.patch("/forget-password" ,error_handler_middleware( auth_service.forget_password_service ) )
auth_controller.put("/reset-password"  , error_handler_middleware(auth_service.reset_password_service)   )




export default auth_controller