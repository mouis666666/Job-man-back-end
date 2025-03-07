
export const gender = {
    MALE : "male",
    FEMALE : "female",
    PRIVATE : "private"
}

export const system_role = {
    USER : "user",
    ADMIN : "admin",
    SUPER_ADMIN :"super-admin"
}

export const OTP_type = {

    confirmEmail : "confirmEmail" ,
    forgetPassword :"forgetPassword"
}

const { USER , ADMIN ,SUPER_ADMIN  } = system_role

export const ADMIN_USER = [ADMIN, USER  ]
export const SUPER_USER_ADMIN = [  SUPER_ADMIN , ADMIN ]
export const SUPER_ADMIN_USER = [ SUPER_ADMIN, USER  ]


export const  provider = {
    SYSTEM:"system",
    GOOGLE : "google",
    GMAIL : "gmail"
} 
export const  NumberOfEmployees = {
    FROM11_20:"11-20",
    FROM20_100 : "20-100",
    FROM100_500 : "100-500",
    FROM500_1000 : "500-1000",
    MORE_THEN1000 : "+1000",
} 

export const  ApplicationStatus = {
    PENDING:'pending',
    ACCEPTED:'accepted',
    VIEWED:'viewed' ,
    IN_CONSIDERATION:'in_consideration',
    REJECTED:'rejected'
} 



export const ImageExtensions = ['image/jpg' , 'image/jpeg',  'image/png']
export const VideoExtensions = [ ' video/mp4' , 'video/avi' ,'Video/mov' ]
export const DocumentExtensions = [ 'application/pdf' , 'application/json' , 'application/javascript' ]


export const  workingTime = { 
    PART_TIME : "part-time ",
    FILL_TIME : "full-time" 
}
export const  seniorityLevel = { 
    FRESH_GRADUATE : "fresh-graduate",
    JUNIOR : "Junior" ,
    MID_LEVEL : "Mid-Level" ,
    SENIOR : " Senior",
    TEAM_LEAD :" Team-Lead" ,
    CEO :" CEO"
}
export const   jobLocation = { 
    ONSITE : "onsite",
    REMOTELY : "remotely" ,
    HYBRID : "hybrid" ,
}


