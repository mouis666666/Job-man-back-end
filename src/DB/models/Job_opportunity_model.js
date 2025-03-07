import mongoose from "mongoose";
import {  jobLocation, seniorityLevel, workingTime } from "../../constants/constants.js";


const job_opportunity_schema = new mongoose.Schema({

    jobTitle : { type : String , 
        minLength:[2 , "this Title is too short"],
        maxLength:[75 , "this Title is too long"] 
    },

    jobLocation : { type : String ,
        default : jobLocation.HYBRID,
        enum : Object.values(jobLocation)
    },

    workingTime :{ type : String ,
        default : workingTime.FILL_TIME,
        enum : Object.values(workingTime)
    },

    seniorityLevel : { type : String ,
        default : seniorityLevel.FRESH_GRADUATE,
        enum : Object.values(seniorityLevel)
    },

    jobDescription : { type : String , 
        minLength:[20 , "this Description is too short"],
        maxLength:[1500 , "this Description is too long"] 
    },

    technicalSkills : [{ 
        SkillName : String ,
        learnAt : String
    }],

    addedBy :{  type : mongoose.Schema.ObjectId ,
        ref : "users"                                      // if i have time i will made it ***********
    },

    updatedBy : {   type : mongoose.Schema.ObjectId ,      // hrId (any hr related to this company can update it
        ref :  "users"

    },

    closed : Boolean ,

    companyId : { type : mongoose.Schema.ObjectId ,
        ref : "companies"                                  // if i have time i will made it ***********
    }



}, {timestamps :true} )



const job_opportunity_model =  mongoose.models.job_opportunities || mongoose.model("job_opportunities" , job_opportunity_schema )

export default job_opportunity_model