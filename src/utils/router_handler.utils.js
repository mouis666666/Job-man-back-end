
import { createHandler } from "graphql-http/lib/use/express";
import auth_controller from "../modules/auth/auth_controller.js"
import user_controller from "../modules/user/user_controller.js";
import { main_schema } from "../GraphQl/main_schema.js";
import company_controller from "../modules/company/company_controller.js";
import Job_controller from "../modules/Job/Job_controller.js";
import chat_Controller from "../modules/chat/chat_controller";




const router_handler = (app , express) =>{

    app.use( "/Assets"  , express.static("Assets") ) // to till the browser that you can browse the photo 


    app.use( "/graphTest"  ,  createHandler({schema : main_schema })  )
    // all the routers 
    app.use( "/auth" , auth_controller )
    app.use( "/user" , user_controller )
    app.use( "/company" , company_controller )
    app.use( "/Job" , Job_controller )
    app.use( "/chat" , chat_Controller )


    app.use(  "*" , ( req , res ) =>{ 
        res.status( 404 ).json({ message :" the Router is not found " })
     } )
}


export default router_handler