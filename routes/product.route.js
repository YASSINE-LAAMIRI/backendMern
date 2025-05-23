const express = require('express');
const {  getOneProd, getAllProd, getMyProd, addProduct, editProd, deleteProd } = require('../controllers/product.controller');
const isAuth = require('../middleware/isAuth');
// router pour la gestion des routes
const router = express.Router();

//test route
// router.get('/test', (req, res) => {
//     res.status(200).json('test ok product route');
// });

//ajouter un produit
//isAuth est un middleware qui verifie si l'utilisateur est authentifié
router.post('/addProduct',isAuth, addProduct);

// recuperer tous les produits
router.get('/allProd',getAllProd)

// recuperer les produits de l'utilisateur authentifié
router.get("/myProd", isAuth, getMyProd);

//l'ordre de la route est important get qui contient id doit étre en dernier
router.get('/:id',getOneProd);

router.put('/:id',isAuth,editProd)

router.delete('/:id',isAuth,deleteProd)
// importation
module.exports = router;
