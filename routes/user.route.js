const express = require('express')
const { getAllUsers, deleteUser, getOneUser,updateProfile } = require('../controllers/user.controller')


const isAdmin = require('../middleware/isAdmin');
const isAuth = require('../middleware/isAuth');
const router = express.Router();

//pour tester la route
// router.get("/test",(req,res)=>{
//     res.status(200).json({msg:"ceci est un test de la route user "})
// })
//admin va lister tous les utilisataurs 
router.get("/allUsers",isAdmin,getAllUsers);

//admin consulte le profil de l'utilisateur 
router.get("/:id",isAdmin,getOneUser)

//admin supprime un utilisateur 
router.delete("/:id",isAdmin,deleteUser)
//   l'utilisateur met à jour son profil
router.put("/profile", isAuth, updateProfile);


module.exports= router