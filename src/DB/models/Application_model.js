import mongoose from "mongoose";
import { ApplicationStatus } from "../../constants/constants.js";


const application_schema = new mongoose.Schema({

    jobId : {type : String ,
        unique : true
    },

    userId : { type :  mongoose.Schema.ObjectId,
        ref : "users",
    },

    userCv :  {  // must be PDF
        secure_url : String ,
        public_id  : String
    },

    status : { type : String ,
        default : ApplicationStatus.PENDING ,
        enum : Object.values(ApplicationStatus)
    }
}, {timestamps :true} )



const application_model =  mongoose.models.applications || mongoose.model("applications" , application_schema )

export default application_model