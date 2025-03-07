import  Router  from 'express';
import * as company_service from "./services/company_service.js"
import { error_handler_middleware } from './../../middlewares/error_handler_middleware.js';
import { authentication_middleware, authorization_middleware } from '../../middlewares/auth_middleware.js';
import { ImageExtensions, system_role } from '../../constants/constants.js';
import { Multer_host } from '../../middlewares/multer_middleware.js';
const company_controller = Router()


const { USER ,  ADMIN  }  = system_role

company_controller.use(authentication_middleware())


company_controller.patch( "/upload_company_logo" ,authorization_middleware([USER , ADMIN]),Multer_host( ImageExtensions ).single("image")  ,error_handler_middleware(company_service.upload_company_logo  ) )
company_controller.put( "/upload_covers_company " ,authorization_middleware([USER , ADMIN]) , Multer_host( ImageExtensions ).array("images" ,5 ) ,error_handler_middleware(company_service.upload_covers_company   ) )



company_controller.delete( "/delete_profile_image" ,authorization_middleware([USER , ADMIN]) ,error_handler_middleware(company_service.delete_profile_image ) )
company_controller.delete( "/delete_cover_images" ,authorization_middleware([USER , ADMIN]) ,error_handler_middleware(company_service.delete_cover_images ) )







export default company_controller