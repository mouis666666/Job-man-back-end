import  Router  from 'express';
import * as user_service from "./services/user_service.js"
import { error_handler_middleware } from './../../middlewares/error_handler_middleware.js';
import { authentication_middleware, authorization_middleware } from '../../middlewares/auth_middleware.js';
import { ImageExtensions, system_role } from '../../constants/constants.js';
import { Multer_host } from '../../middlewares/multer_middleware.js';
const user_controller = Router()


const { USER ,  ADMIN  }  = system_role

user_controller.use(authentication_middleware())

user_controller.post( "/Update_user_account" ,authorization_middleware([USER , ADMIN]) ,error_handler_middleware(user_service.Update_user_account ) )
user_controller.get( "/Get_user_data" ,authorization_middleware([USER , ADMIN]) ,error_handler_middleware(user_service.Get_user_data ) )
user_controller.post( "/Get_data_another_user" ,authorization_middleware([USER , ADMIN]) ,error_handler_middleware(user_service.Get_data_another_user ) )
user_controller.patch( "/Update_password" ,authorization_middleware([USER , ADMIN])  ,error_handler_middleware(user_service.Update_password  ) )
user_controller.patch( "/upload_profile_image" ,authorization_middleware([USER , ADMIN]),Multer_host( ImageExtensions ).single("image")  ,error_handler_middleware(user_service.upload_profile_image  ) )
user_controller.put( "/upload_cover_images" ,authorization_middleware([USER , ADMIN]) , Multer_host( ImageExtensions ).array("images" ,5 ) ,error_handler_middleware(user_service.upload_cover_images   ) )



user_controller.delete( "/delete_profile_image" ,authorization_middleware([USER , ADMIN]) ,error_handler_middleware(user_service.delete_profile_image ) )
user_controller.delete( "/delete_cover_images" ,authorization_middleware([USER , ADMIN]) ,error_handler_middleware(user_service.delete_cover_images ) )

user_controller.post( "/Soft_delete_account" ,authorization_middleware([USER , ADMIN]) ,error_handler_middleware(user_service.Soft_delete_account ) )






export default user_controller