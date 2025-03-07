import mongoose from "mongoose"


const DataBase =  async  () =>{


    try {
        
        const connection = await mongoose.connect( `${ process.env.DB_URI }`)

        if (connection) {
            console.log( "database is working" );
        }
        

    } catch (error) {
        console.log( "database is failed" , error);
        
    }
}


export default DataBase