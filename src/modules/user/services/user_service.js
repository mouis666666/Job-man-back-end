import { compareSync, hashSync } from "bcrypt"
import user_model from "../../../DB/models/user_model.js"
import { decryption, encryption } from "../../../utils/encryption.utils.js"
import black_list_model from "../../../DB/models/black_list_model.js"
import { cloudinary } from "../../../config/cloudinary_config.js"






export const Update_user_account =  async ( req ,res ) =>{


    const { _id } = req.login_user
    const {firstName, lastName   , mobileNumber , DOB , gender } = req.body


    // find the user
    const user = await user_model.findById(_id)
    if (!user) { return res.status(404).json({ massage:" this user not found " }) }

    // phone updata
    if (mobileNumber ) {  user.mobileNumber  = await encryption({ value:mobileNumber  , secret_key:process.env.PHONE_SECRET_KEY }  ) }

    user.firstName = firstName
    user.lastName = lastName
    user.DOB = DOB
    user.gender = gender
    await user.save(); 


    return res.status(200).json({ massage: " profile data updated successfully", user })
} 



export const Get_user_data =  async ( req ,res ) => {

    const { _id } = req.login_user;
    
    
    // find the user by id
    const user = await user_model.findById( _id , "-password -__v" )
    if (!user) { return res.status(404).json({ massage:" this user not found " }) }

    // console.log("Encrypted phone:", user.phone);

    //decrypt the phone 
    user.mobileNumber  = await decryption( { cipher:user.mobileNumber  , secret_key:process.env.PHONE_SECRET_KEY } ) 
    return res.status(200).json({ massage: " user found successfully " , user })
}




export const Get_data_another_user =  async ( req ,res ) =>{
    

    const { _id } = req.body;
    
    
    // find the user by id
    const user = await user_model.findById( _id , "-password -__v -DOB -gender -provider -role -OTP -isConfirmed -email -deletedAt " )
    
    if (!user) { return res.status(404).json({ massage:" this user not found " }) }

    // console.log("Encrypted phone:", user.phone);

    //decrypt the phone 
    user.mobileNumber  = await decryption( { cipher:user.mobileNumber  , secret_key:process.env.PHONE_SECRET_KEY } ) 
    return res.status(200).json({ massage: " user found successfully " , user })

} 


export const Update_password  =  async ( req ,res ) =>{

    const { _id , token } = req.login_user
    const { old_password , new_password , confirm_password  } = req.body

    // check if the pass == conf_pass
    if ( new_password !== confirm_password ) { return res.status(404).json({  message : " the password does't match the confirmation_password"})  }

    // find the user
    const user = await user_model.findById(_id)
    if (!user) { return res.status(404).json({ massage:" this user not found " }) }

    //compare the pass
    const if_password_match = compareSync(old_password , user.password )
    // console.log(if_password_match);
    if (!if_password_match) { return res.status(404).json({ message:" the password is wrong" }) }

    // updata the user password
    const hash_new_pass = hashSync(new_password , +process.env.SALT )
    user.password = hash_new_pass
    await user.save();

    // make sure that the user is not logout
    await black_list_model.create( token )
    
    return res.status(200).json({ message: " password updated successfully" })
} 




export const upload_profile_image = async ( req , res  ) =>{
    const   { _id } = req.login_user
    const   { file } = req
    if (!file) { return  res.status(404).json({ message :" there is no uploaded file" })}
 
 
    
    const { public_id , secure_url } = await cloudinary().uploader.upload(file.path, {
        folder: `/${process.env.FOLDER_NAME_CLOUDINARY}/User/Profile/ProfilePicture`
     });
    
    // send the data to cloudinary
     const User = await user_model.findByIdAndUpdate(_id ,{ profilePic: {public_id , secure_url}} , {new :true}  )
  
     if (!User) {return  res.status(409).json({ message :" failed to upload the picture " , User })}
     // Return response properly
     res.status(200).json({ message: "The photo has been uploaded", User });
}
 
 
 



 
export const  upload_cover_images = async ( req , res  ) =>{
 
     const   { _id } = req.login_user
     const   { files } = req
     console.log(files);
     
     if (!files) { return  res.status(404).json({ message :" there is no uploaded file" })}
 
     const images = []
     for (const file of files) {
         const { public_id , secure_url } = await cloudinary().uploader.upload(file.path, {
             folder: `/${process.env.FOLDER_NAME_CLOUDINARY}/User/cover/coverPictures`
         });
         images.push( {public_id , secure_url} )
     }
 
     
     // send the data to cloudinary
      const User = await user_model.findByIdAndUpdate(_id ,{ coverPic:images } , {new :true}  )
   
      if (!User) {return  res.status(409).json({ message :" failed to upload the picture " , User })}
      // Return response properly
      res.status(200).json({ message: "The photos has been uploaded", User });
} 
 
 
 



export const delete_profile_image =  async ( req ,res ) =>{

    res.status(200).json({ message :" the data has been backed " })
} 





export const delete_cover_images =  async ( req ,res ) =>{

    res.status(200).json({ message :" the data has been backed " })
} 





export const Soft_delete_account =  async ( req ,res ) =>{

    res.status(200).json({ message :" the data has been backed " })
} 




























//   this for testing data social app


 export const delete_user_account = async ( req , res ) =>{
 
     const { _id } = req.login_user
     
     // delete from database
     const delete_user = await user_model.findByIdAndDelete(_id)
     if (!delete_user) { return  res.status(404).json({ message :" User account has not deleted" })}
     console.log(delete_user);
 
     // delete the content inside the folders
     const delete_content = await cloudinary().api.delete_resources_by_prefix(`${process.env.FOLDER_NAME_CLOUDINARY}/User/cover/coverPictures` )
     const delete_contents = await cloudinary().api.delete_resources_by_prefix(`${process.env.FOLDER_NAME_CLOUDINARY}/User/Profile/ProfilePicture` )
     // console.log( delete_contents);
     
     
     // delete the files itself
     const delete_folder = await cloudinary().api.delete_folder( `${process.env.FOLDER_NAME_CLOUDINARY}/User/cover/coverPictures` )
     const delete_folders = await cloudinary().api.delete_folder( `${process.env.FOLDER_NAME_CLOUDINARY}/User/Profile/ProfilePicture` )
 
     res.status(200).json({ message: "User account has been deleted" , delete_folder , delete_folders });
 }
  
 







