
// Importation du modèle User
const { json } = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt")
const jwt=require("jsonwebtoken")
//Définition de la fonction "register"
exports.register =async(req,res)=>{
try {
    // Récupération des données du corps de la requête

//     c'est lequivalent de :       const name = req.body.name;
//      const email = req.body.email;
//      const password = req.body.password;
//       const phone = req.body.phone;
    const {name,email,password,phone} = req.body;
    //VERIFIER SI USER EXISTE VIA EMAIL dans DB
    const foundUser= await User.findOne({email})

    if (foundUser) {
       return res.status(400).json({error:[{msg:"Cet Emeil existe déja❌ !"}]})
        
    }

    //securiser le Password 
    const saltRound =10;
    const hashPassword= await bcrypt.hash(password,saltRound)
    
    const newUser = new User( {name,email,password:hashPassword,phone})
    
    await newUser.save()
    //créer le Token 
    const token = jwt.sign(
        { id: newUser._id},
        process.env.SECRET_KEY, // dans .env
        { expiresIn: "2h" }
      );

    res.status(200).json({
        success:[{msg:"Enregistrement avec succées !"}],
        User:newUser,
        token})

} catch (error) {
    res.status(400).json({errors:[{msg:"enregistrement a échoué"}],error})
}
}

// login:

exports.login=async (req,res) =>{
try {
    const {email,password} = req.body;
    const foundUser = await User.findOne({email})
    if (!foundUser){
        return res.status(400).json({errors:[{msg:"Email ou motde passe incorrect !"}]})
    }
    const checkPassword = await bcrypt.compare(password,foundUser.password)

    //verfier le mot de passe

    if (!checkPassword){
        return res.status(400).json({errors:[{msg:"Email ou motde passe incorrect 2 !"}]})
    }

     //créer le Token
     const token = jwt.sign(
        { id: foundUser._id},
        process.env.SECRET_KEY, // dans .env
        { expiresIn: "2h" }
      );

    res.status(200).json({succes:[{msg:"login successefully !"}],User:foundUser,token})


} catch (error) {
    res.status(400).json({errors:[{msg:"login a échoué"}],error})
    
}

}