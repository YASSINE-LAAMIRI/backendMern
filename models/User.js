//require mongoose

//creation du model
const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    email:{
            type:String,
            required:true,
            unique:true,
        },
    password:{
        type:String,
        required:true,

    },
    phone:{
        type:Number,
       
    },
     image: {
      type: String,   // URL de l'image, 
      default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRACRZ6IGSwYv_W7iPli8rz8SaBLBTfMSHctg&s',  // image par défaut si pas précisée
    },
    isAdmin:{

        type:Boolean,
        default:false,
    }
   
},
{
    timestamps:true,
    }
)
 //instanse


const User = mongoose.model("user",userSchema);
module.exports=User;