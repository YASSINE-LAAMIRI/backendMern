//require de mongoose

const mongoose=require("mongoose");
//fonction de connection a la BD 

const connectDB = async()=>{

    try {
        await mongoose.connect(process.env.DB_URI)
        console.log("DB connected... 👌")


        
    } catch (error) {
        console.log("merci de verifier la connection à la BD ❌⁉️ ")
    }
}

module.exports=connectDB;