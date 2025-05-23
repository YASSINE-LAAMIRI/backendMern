const Product= require("../models/Product");

exports.addProduct = async (req, res) => {
  try {

    const newProd = new Product({
        //
        ...req.body, 
        addedBy: req.user.id,
      
    });
    await newProd.save();
    res.status(200).json({ msg:"produit ajouté avec succès" , newProd });

//     const { title, description, price, category, quantity } = req.body;
//     const newProduct = new Product({
//       title,
//       description,
//       price,
//       category,
//       quantity,
//       image: req.file.path,
//       addedBy: req.user._id,
//     });
//     await newProduct.save();
//     res.status(200).json({ success: { msg: "produit ajouté avec succès" }, newProduct });
//   } catch (error) {
//     res.status(400).json({ errors: { msg: "echec d'ajout du produit" } });
//   }
} catch (error) {
    res.status(400).json({msg: "echec d'ajout du produit"  });
  }

}   

exports.getAllProd =  async(req, res) => {
  try {
    const listProd = await Product.find();
    res.status(200).json({ msg: "la liste de tous les produits", listProd });
  } catch (error) {
    res.status(400).json(errors) 
  }
};

 
exports.getOneProd = async (req, res) => {
  try {
    const {id} = req.params;
    const prodToGet = await Product.findById(id);
    if (!prodToGet) {
      return res.status(404).json({ errors: { msg: "Ce produit n'existe pas!" } });
    }
   return res.status(200).json({ success: { msg: "le produit recherché est :" }, prodToGet });

  } catch (error) {
    res.status(400).json(error) 
  }
};


exports.getMyProd = async (req, res) => {
  try {
  
  const myProdList = await Product.find({ addedBy: req.user._id });

   res.status(200).json({ msg: "la liste de mes produits:", myProdList });
  

  if (!myProdList) {
    return res.status(404).json({ errors: { msg: "Aucun produit trouvé!" } });
  }

} catch (error) {
   res.status(400).json(error) 
}
}



exports.editProd = async (req, res) => {
  try {
  
  const { id } = req.params;//le produit a editer 
  const prodToChange = req.body // le changement a faire
  const prodToEdit = await Product.findByIdAndUpdate(id, prodToChange, {new: true});
console.log(prodToEdit.addedBy)
console.log(req.user._id)
if (!prodToEdit) {
    return res.status(404).json({ errors: { msg: "Ce produit n'existe pas!" } });
  }

  if(prodToEdit.addedBy.toString() !== req.user._id.toString()){

    return   res
    .status(403)
    .json({msg:"vous n'avez pas le droit de modifier ce produit"})
  }

  
  // Envoi de la réponse
    res.status(200).json({ msg: "le produit a été modifié avec succès", prodToEdit });

} catch (error) {
   res.status(400).json(error) 
}
}


exports.deleteProd = async (req, res) => {
  try {
  
  const { id } = req.params;//le produit a editer 
const prodToDel = await Product.findByIdAndDelete(id);

  if (!prodToDel) {
    return res
    .status(404)
    .json({ msg: "Ce produit n'existe pas!" } );
  }

  if(prodToDel.addedBy.toString() !== req.user._id.toString()){
    return res
    .status(400).json({msg:"vous n'avez pas le droit de supprimer ce produit"})
  }
  // Supprimer le produit
   res.status(200).json({ msg: "le produit a été supprimé avec succès", prodToDel });
  
} catch (error) {
   res.status(400).json(error) 
}
}

// exports.deleteProd = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // 1. Trouver le produit sans encore le supprimer
//     const prodToDel = await Product.findById(id);

//     // 2. Vérifier s'il existe
//     if (!prodToDel) {
//       return res.status(404).json({ errors: { msg: "Ce produit n'existe pas!" } });
//     }

//     // 3. Vérifier le propriétaire
//     if (prodToDel.addedBy.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ errors: { msg: "Vous n'avez pas le droit de supprimer ce produit." } });
//     }

//     // 4. Supprimer le produit 
//     await Product.findByIdAndDelete(id);

//     res.status(200).json({ msg: "Le produit a été supprimé avec succès", prodToDel });

//   } catch (error) {
//     res.status(400).json({ error: error.message || "Erreur lors de la suppression du produit" });
//   }
// };
