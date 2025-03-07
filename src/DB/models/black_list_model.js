import mongoose from "mongoose";


 const black_list_schema = new mongoose.Schema({

    token_id : {  type : String , require : true , unique : true},
    expiration_data : {  type : String , require : true }


},{timestamp:true}  )




const black_list_model = mongoose.models.black_list || mongoose.model("black_list" , black_list_schema)


export default black_list_model