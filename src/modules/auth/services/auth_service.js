import bcrypt ,{ compareSync, hashSync } from "bcrypt";
import { email_emitter } from "../../../config/send_email_verify_config.js";
import { OTP_type, provider } from "../../../constants/constants.js";
import user_model from "../../../DB/models/user_model.js";
import { encryption } from './../../../utils/encryption.utils.js';
import { v4 as uuidv4 } from 'uuid';
import jwt  from 'jsonwebtoken';
import black_list_model from "../../../DB/models/black_list_model.js";
import { OAuth2Client } from "google-auth-library";




export const sign_up_service = async (req , res ) =>{ // Done
    const {  firstName, lastName  , email , mobileNumber , password , rePassword , DOB , gender  } = req.body

    if (password !== rePassword ) { return res.status(401).json({ message :" the password and ans the rePassword must be identical " })  }

    const user = await user_model.findOne({email})
    if (user) { return res.status(409).json({ message : "this email is exists" }) }
    
    // const if_name_exists = await  user_model.findOne({name})
    // if (if_name_exists) { return res.status(409).json({ message : "name must be unique" }) }

    // encrypt the mobileNumber
    const mobileNumber_encrypted = await encryption({value:mobileNumber , secret_key:process.env.PHONE_SECRET_KEY}  )

    // hash the password
    const password_hashed =  hashSync(password , +process.env.SALT)

    // make the OTP and save it in the database
    const OTP =  Math.floor(Math.random()*10000);
    const hash_otp = bcrypt.hashSync( OTP.toString() , +process.env.SALT )
    console.log(OTP);
    

    email_emitter.emit( "send_email" ,  {
        to : email ,
        subject : " this mail for  verify your email",
        html :` <h2> verify your email </h2>
        <h1 > Your OTP is => ${OTP} </h1> `,
    } );
    
    
    
    const  User = await user_model.create({
        firstName , 
        lastName ,
        email ,
        mobileNumber:mobileNumber_encrypted ,
        password:password_hashed ,
        DOB ,
        gender ,
        OTP :{ otp : hash_otp, otpMission : OTP_type.confirmEmail ,  expiresDate :Date.now()   }
    })


    if (User) {
        res.status(201).json( {massage:"email created successfully  there is a verification email sended to you ",User } )
    }else{
        res.status(409).json({ massage: "create is failed , try again later"})
    }
}


export const confirmOtpService = async (req, res) => {
      const { email , otp } = req.body;
  
      // Find the user by email and OTP type
      const user = await user_model.findOne({ email, "OTP.type": "confirmEmail" });
      if (!user) return res.status(404).json({ message: "User not found or OTP expired" });
  
      // Get the OTP entry from the user document
      const otpEntry = user.OTP.find((o) => o.type === OTP_type.confirmEmail );
      if (!otpEntry || new Date() > otpEntry.expiresIn || !bcrypt.compareSync(otp, otpEntry.code)) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
  
      // Mark user as confirmed and remove OTP entry
      user.isConfirmed = true;
      user.OTP = user.OTP.filter((o) => o.type !== OTP_type.confirmEmail );
      await user.save();
  
  };

export const confirm_OTP_service = async (req , res ) =>{

    const { email , otp } = req.body;
  
    // Find the user by email and OTP type
    const user = await user_model.findOne({ email, "OTP.type": "confirmEmail" });
    if (!user) return res.status(404).json({ message: "User not found or OTP expired" });

    // Get the OTP entry from the user document
    const otpEntry = user.OTP.find((o) => o.type === OTP_type.confirmEmail );
    if (!otpEntry || new Date() > otpEntry.expiresIn || !bcrypt.compareSync(otp, otpEntry.code)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark user as confirmed and remove OTP entry
    user.isConfirmed = true;
    user.OTP = user.OTP.filter((o) => o.type !== OTP_type.confirmEmail );
    await user.save();

    res.status(200).json( {massage:"email created is confirmed " } )
}



export const sign_in_service = async ( req , res  ) =>{ // Done 50%

    const { email , password } = req.body

    // find the email 
    const User = await user_model.findOne({email})
    if (!User) { return res.status(404).json({ message : "this email is not exists" }) }

    //check the password
    const if_pass_right = bcrypt.compareSync( password , User.password )    
    if ( !if_pass_right ) { return res.status(404).json({ message : "email or password is wrong" }) }

    const access_token = jwt.sign( { email:email , _id:User._id } ,process.env.ACCESS_TOKEN_KEY , {expiresIn:process.env.EXPIRATION_DATA_ACCESS_TOKEN_KEY , jwtid:uuidv4() } )
    const refresh_token = jwt.sign( { email:email , _id:User._id } ,process.env.REFRESH_TOKEN_KEY , {expiresIn:process.env.EXPIRATION_DATA_REFRESH_TOKEN_KEY , jwtid:uuidv4() } )


    
    res.status(200).json({ message :" user has been sign in " , access_token , refresh_token  })
}



export const refresh_token_service = async ( req , res ) => { // Done

    const {refresh_token} = req.headers
    
    // decoding data
     const decoding_refresh_token = jwt.verify( refresh_token , process.env.REFRESH_TOKEN_KEY )
        

    // rasta of decoding data
     const access_token = jwt.sign( { _id:decoding_refresh_token._id , email:decoding_refresh_token.email } , process.env.ACCESS_TOKEN_KEY, {expiresIn:process.env.EXPIRATION_DATA_ACCESS_TOKEN_KEY , jwtid:uuidv4() }  ) 
     res.status(201).json({ massage:" access token has been refreshed " , access_token })
        
}



export const sign_in_gmail_service = async ( req , res ) =>{ // Done

    const { idToken } = req.body


    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.WEB_CLIENT_ID,  // Specify the WEB_CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const { email_verified , email } = payload;
    
    if (email_verified !== true) { return res.status(404).json({ message :" login has been failed "  })}

    const User = await  user_model.findOne({ email:email , provider:provider.GOOGLE })
    if (!User) { return res.status(404).json({ message :" user not found"  })}
    // console.log(User);
    

    const access_token = jwt.sign( {email:email , _id :User?._id } , process.env.ACCESS_TOKEN_KEY , { expiresIn :process.env.EXPIRATION_DATA_ACCESS_TOKEN_KEY , jwtid:uuidv4()}  )
    const refresh_token = jwt.sign( {email:email , _id :User?._id } , process.env.REFRESH_TOKEN_KEY , { expiresIn :process.env.EXPIRATION_DATA_REFRESH_TOKEN_KEY , jwtid:uuidv4()}  )

   res.status(200).json({ message :" user has been login from back " , access_token , refresh_token  })
}




export const sign_up_gmail_service = async ( req , res ) =>{ // Done

    const { idToken } = req.body

    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.WEB_CLIENT_ID,  // Specify the WEB_CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const { email_verified , email ,  name } = payload;

    // check if verify
    if (email_verified !== true) { return res.status(404).json({ message :" login has been failed "  })}

    // check if email is here
    const User = await  user_model.findOne({email})
    if (User) {return res.status(409).json({ message :" this email is already exists" })}

    const new_user = await user_model.create({
        name,
        isConfirmed : true ,
        provider : provider.GOOGLE,
        email,
        password : hashSync(uuidv4() , +process.env.SALT_SPECIAL )
    })



    res.status(200).json({ message :" user has been signUp from back " })
}




export const sign_out_service = async ( req , res ) =>{ // Done


    try {
        const { access_token , refresh_token } = req.headers

        //decoding data from access_token
        const decoded_access_data = jwt.verify(access_token , process.env.ACCESS_TOKEN_KEY  )
        const decoded_refresh_data = jwt.verify(refresh_token , process.env.REFRESH_TOKEN_KEY )      


        // const token_id = decoded_access_data.jti
        // const token_exp = decoded_access_data.exp
        // console.log(decoded_access_data);

        // const token_id = decoded_refresh_data.jti
        // const token_exp = decoded_refresh_data.exp
        // console.log(decoded_refresh_data);
        

         const revoke_token =  await black_list_model.insertMany( [
            { token_id : decoded_access_data.jti, expiration_data :decoded_access_data.exp },
            { token_id : decoded_refresh_data.jti, expiration_data :decoded_refresh_data.exp }
         ])
        //  console.log(revoke_token , " fdddddddddddddddd");
         

        res.status(201).json({ massage:" sign out has been succeeded " })
    } catch (error) {
        console.log("internal server error sign out" , error);
        res.status(500).json({massage:"internal server error sign out"})

        
    }
}



export const forget_password_service = async (req , res ) =>{ // Done


        const { email } = req.body

        // find the email
        const  user = await  user_model.findOne({email})
        if (!user ) { return res.status(404).json({  massage : " email is not found "})  }

        // make the OTP and save it in the database
        const OTP =  Math.floor(Math.random()*10000);
        const hash_otp = hashSync( OTP.toString() , +process.env.SALT )
        console.log(OTP);
        
        user.OTP.push({
            otp: hash_otp,
            otpMission: OTP_type.forgetPassword,
            expiresDate: Date.now() + 10 * 60 * 1000 // Expire in 10 minutes
        });
        await user.save()

        //send the OTP in the email 
        email_emitter.emit("send_email" , {
            to:user.email, // Single Source of Truth => mean must take the last code that you took and use it for good performance
            subject : "reset your password if this is not you forget about it" ,
            html: `welcome to social App</hl>
            <p> the OTP is ${OTP}</p>` ,
        } )
        
        
        res.status(201).json({ massage:" OTP has been sended successfully " })

}


export const reset_password_service = async (req , res ) =>{ //Done



    const { OTP , email , new_password , confirm_password } = req.body ;

    if ( new_password !== confirm_password ) { return res.status(404).json({  massage : " the password does't match the confirmation_password"})  }

    const user = await user_model.findOne({email})    
    if(!user) return res.status(401).json({msg:'user not found'})

        // here we should make a for etch loop
    // Check if user has OTPs stored
    if (!user.OTP || user.OTP.length === 0) {
        return res.status(400).json({ message: "No OTP found for this user" });
    }

    let isValidOTP = false;

    // Loop through all stored OTPs
    for (const otpEntry of user.OTP) {
        if (otpEntry.otpMission === OTP_type.forgetPassword) { 
            const isValid = compareSync(OTP.toString(), otpEntry.otp); 
            if (isValid) {
                isValidOTP = true;
                break; // Stop looping if a valid OTP is found
            }
        }
    }

    if (!isValidOTP) return res.status(401).json({ message: "Invalid OTP" });

    // Hash the new password
    user.password = hashSync(new_password, +process.env.SALT);
    

    await user.save();


    res.status(201).json({ massage:" password has been changed successfully " })

}

export const CRON_expired_OTP_service = async ( req ,res ) =>{

    
} 