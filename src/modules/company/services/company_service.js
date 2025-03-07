
import company_model from './../../../DB/models/company_model.js';
import { cloudinary } from "../../../config/cloudinary_config.js"






/**
 * 1. Add company. (2 Grades) **🤢🤢🤢🤢**
    - Ensure that the company email and company name not exist before.
2. Update company data. (2 Grades)**🤢🤢🤢🤢**
    - Only the company owner can update the data
    - user can update all data except legal attachement
3. Soft delete company. (2 Grades) (👀)**🤢🤢🤢🤢**
    - Ensure that only the admin or the company owner can perform this
4. Get specific company with related jobs. (2 Grades)**🤢🤢🤢🤢**
    - Send the companyId
    - Return all jobs related to this company using virtual populate
5. Search for a company with a name. (1 Grade)**🤢🤢🤢🤢**
6. Upload company logo (1 Grade)
7. Upload company Cover Pic (1 Grade) 
8. Delete company logo (1 Grade)
9. Delete company Cover Pic (1 Grade)
 * */ 














export const upload_company_logo = async ( req , res  ) =>{
    const   { _id } = req.login_user
    const   { file } = req
    if (!file) { return  res.status(404).json({ message :" there is no uploaded file" })}
 
 
    
    const { public_id , secure_url } = await cloudinary().uploader.upload(file.path, {
        folder: `/${process.env.FOLDER_NAME_CLOUDINARY}/company/companyLogo`
     });
    
    // send the data to cloudinary
     const company = await company_model.findByIdAndUpdate(_id ,{ logo: {public_id , secure_url}} , {new :true}  )
  
     if (!company) {return  res.status(409).json({ message :" failed to upload the picture " , company })}
     // Return response properly
     res.status(200).json({ message: "The photo has been uploaded", company });
}
 
 
 



 
export const  upload_covers_company = async ( req , res  ) =>{
 
     const   { _id } = req.login_user
     const   { files } = req
    //  console.log(files);
     
     if (!files) { return  res.status(404).json({ message :" there is no uploaded file" })}
 
     const images = []
     for (const file of files) {
         const { public_id , secure_url } = await cloudinary().uploader.upload(file.path, {
             folder: `/${process.env.FOLDER_NAME_CLOUDINARY}/company/coverPictures`
         });
         images.push( {public_id , secure_url} )
     }
 
     
     // send the data to cloudinary
      const company = await company_model.findByIdAndUpdate(_id ,{ coverPic:images } , {new :true}  )
   
      if (!company) {return  res.status(409).json({ message :" failed to upload the picture " , company })}
      // Return response properly
      res.status(200).json({ message: "The photos has been uploaded", company });
} 
 
 
 



export const delete_profile_image =  async ( req ,res ) =>{

    res.status(200).json({ message :" the data has been backed " })
} 





export const delete_cover_images =  async ( req ,res ) =>{

    res.status(200).json({ message :" the data has been backed " })
} 


