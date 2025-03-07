import mongoose from "mongoose";
import { gender, OTP_type, provider, system_role } from "../../constants/constants.js";


const user_schema = new mongoose.Schema({
    firstName :{type : String ,
        require :true ,
        lowercase:true,
        trim:true,
        minLength:[4 , "this name is too short"],
        maxLength:[22 , "this name is too long"]    
    },    
    lastName :{type : String ,
        require :true ,
        lowercase:true,
        trim:true,
        minLength:[4 , "this name is too short"],
        maxLength:[22 , "this name is too long"]    
    },
    email : { type : String ,
        unique: [true , "the email must be unique"] ,
        require : true,
    },
    password : {type : String , 
        require : true ,

     },
    provider : { type : String , 
        default : provider.SYSTEM,
        enum : Object.values(provider)
    },
    gender : { type : String ,
        default : gender.PRIVATE,
        enum : Object.values(gender)
    },
    DOB : { type : Date ,
        require : true ,
        enum :Date.now()
    },
    mobileNumber : { type : String ,
        require : [true , "phone number must be require"]
    },
    role : { type : String ,
        default : system_role.USER ,
        enum : Object.values(system_role)
    },
    isConfirmed : { type : Boolean ,
        default : false
    },
    deletedAt : { type : Date ,
        default : null
    },
    bannedAt :{ type : Date , 
        default : null
    },
    updatedBy : { type : String ,
        ref : "users",
        default : null
    },
    changeCredentialTime : { type : Date ,
        default : null
    },
    profilePic : { 
        secure_url : String ,
        public_id  : String
    },
    coverPic :  { 
        secure_url : String ,
        public_id  : String
    },
    OTP : [ {   otpMission :{ 
        type : String ,
        enum :Object.values(OTP_type)
    },
    otp : {
        type:String
    },
    expiresDate :Date
    }]
}, {timestamps :true} )


// ----------------------------------------------------  the virtual field
user_schema.virtual('fullName').
  get(function() { return `${this.firstName} ${this.lastName}`; }).set(function(v) {


    // `v` is the value being set, so use the value to set
    // `firstName` and `lastName`.
    const firstName = v.substring(0, v.indexOf(' '));
    const lastName = v.substring(v.indexOf(' ') + 1);
    this.set({ firstName, lastName });
});







// ----------------------------------------------------  hooks



const user_model =  mongoose.models.Users || mongoose.model("Users" , user_schema )


// ----------------------------------------------------  this is for testing now
const doc = new user_model();

doc.fullName = `${user_schema.firstName , user_schema.lastName }`;

doc.fullName; // 'Jean-Luc Picard'
doc.firstName; // 'Jean-Luc'
doc.lastName; // 'Picard'







export default user_model