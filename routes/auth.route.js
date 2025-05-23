const express = require('express')
const { register, login } = require('../controllers/auth.controller')
const { registerValidation, loginValidation, validation } = require('../middleware/validator')
const isAuth = require('../middleware/isAuth')
// creation de la route
const router = express.Router()

//test avec le postman

router.get("/test",(req,res)=>{
    res.json('ceci est un test route auth')
})

// Route pour l'inscription
router.post("/register", registerValidation(), validation, register);

// Route pour la connexion
router.post("/login", loginValidation(), validation, login);
//Route current (l'utilisateur qui est authentifier )
router.get("/current",isAuth,(req,res)=>{
    res.json(req.user);
})
module.exports=router;

