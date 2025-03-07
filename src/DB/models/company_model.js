import mongoose from "mongoose";
import { NumberOfEmployees } from "../../constants/constants.js";


const company_schema = new mongoose.Schema({

    companyName : { type : String , 
        unique:[true , "the name must to be unique"],
        lowercase:true,
        minLength:[3 , "this name is too short"],
        maxLength:[75 , "this name is too long"]  
     },

     description : { type : String ,
        minLength :[20 , " this description is  to short "],
        maxLength :[800 , " this description is  to long "]
     },

     industry : {type : String ,
        require : true
     },

     address : {type : String ,
        require : true
     },

     numberOfEmployees : { type : String , 
        default : NumberOfEmployees.FROM11_20,
        enum : Object.values(NumberOfEmployees)
    },

    companyEmail : {type : String ,
        require : true,
        unique :true
    },

    createdBy : {type : String ,
        creatorId : mongoose.Schema.ObjectId,
        ref : "users"
    },
    
    logo : { 
        secure_url : String ,
        public_id  : String
    },

    coverPic :  { 
        secure_url : String ,
        public_id  : String
    },

    HRs : [{
        type : String ,
        unique : true
    }],

    deletedAt : { type : Date ,
        default : null
    },

    bannedAt :{ type : Date , 
        default : null
    },

    legalAttachment : {  // this must be PDF or img
        secure_url : String ,
        public_id  : String
    },
    
    approvedByAdmin : { type : Boolean , 
        default : false
    }

     
}, {timestamps :true} )



const company_model =  mongoose.models.companies || mongoose.model("companies" , company_schema )

export default company_model
