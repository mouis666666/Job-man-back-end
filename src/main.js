import express from "express"
import dotenv from "dotenv"
import router_handler from "./utils/router_handler.utils.js"
import DataBase from "./DB/connection.js"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
dotenv.config()


// to allow who can call me
const whitelist = [process.env.FRONT_END_ORIGIN , undefined /* to tell the cors to accept postman requests ( need to delete it after the test ) */ ]
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}




// to limit much req
const rate_limit =  rateLimit({
    windowMs : 15 * 60 * 1000 , // 15 minutes
    limit : 10 ,
    message : "too many requests , please try again later" ,
    legacyHeaders : false
})




const bootstrap = () =>{
    const app = express()

    // to parse all coming data 
    app.use(express.json())

    //security part
    app.disable("X-Powered-By")
    app.use(cors(corsOptions))
    app.use(helmet({xContentTypeOptions : false , crossOriginOpenerPolicy :false }) )
    app.use(rate_limit)

    // this is for test 
    app.get( "/test" , async (req , res ) =>{ await res.send( "  hello from test " )   } )

    // call the database
    DataBase()
    
    // all routers here 
    router_handler(app ,express )
    
    app.listen(process.env.PORT, () => {
        console.log("the server is running" , process.env.PORT );
        
    } )
}


export default bootstrap


