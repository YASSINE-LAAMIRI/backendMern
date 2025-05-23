const jwt=require("jsonwebtoken")
const User = require("../models/User")



const isAuth = async(req,res,next)=>{
    try {

        //si le token existe dans le header
        const token=req.headers["authorization"]
        if(!token){
            return res.status(401).json({errors:[{msg:"pas de token"}]})
        }
        //Est-ce que ce token est bien signé avec la bonne clé secrète ?
        const decode=jwt.verify(token,process.env.SECRET_KEY)
        //verifier id existe dans token correspont au user dans la BD
        const foundUser= await User.findOne({_id:decode.id})
        if(!foundUser){
            return res.status(401).json({errors:[{msg:"User non trouvé"}]})
        }
        //recupper les données du user 
        req.user=foundUser;
        next();

    } catch (error) {
        res.status(401).json({errors:[{msg:"Impossible de vérifier"}]})
        
    }
}
module.exports= isAuth;