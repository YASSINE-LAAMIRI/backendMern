const {check,validationResult}= require ('express-validator')

//middleware pour verification

exports.registerValidation=()=>[

    check("name","Name is required").not().isEmpty(),
    check("email","Enter a valid Email").isEmail(),
    check("password","Enter a valid password").isLength({min:8,max:15})
];

exports.loginValidation=()=>[

    check("email","Enter a valid Email").isEmail(),
    check("password","Enter a valid password").isLength({min:8,max:15})
];

exports.validation = (req,res,next)=>{
    const errors = validationResult(req)
    errors.isEmpty()?next():res.status(400).json({errors:errors.array()})
}


