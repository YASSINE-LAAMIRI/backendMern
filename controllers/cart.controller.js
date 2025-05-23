const Cart = require('../models/Cart');
const Product = require('../models/Product');

// 🔹 POST : Add Item to Cart
exports.addToCart = async (req, res) => {


    const { productId, quantity } = req.body;
    console.log('👉 req.user:', req.user._id);
    console.log('👉 req.body:', req.body);
console.log('🛑 type de quantity:', typeof quantity, 'valeur:', quantity);
if (!req.user || !req.user._id) {
  return res.status(401).json({ msg: "Utilisateur non authentifié 🔒" });
}
    if (!productId || !quantity) {
        return res.status(400).json({ msg: 'productId et quantity sont requis 🛑' });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Produit non trouvé 🙁' });
        }

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const item = cart.items.find(item => item.product.toString() === productId);
        const quantityToAdd = parseInt(quantity);

        if (item) {
            item.quantity += quantityToAdd;
        } else {
            cart.items.push({ product: productId, quantity: quantityToAdd });
        }

        const totalAmount = await Promise.all(
            cart.items.map(async (item) => {
                const product = await Product.findById(item.product);
                return product.price * item.quantity;
            })
        );

        cart.total = totalAmount.reduce((acc, curr) => acc + curr, 0);

        await cart.save();
        res.status(200).json({ msg: 'Produit ajouté au panier 🛒', cart });
    } catch (error) {
        console.error('❌ Erreur addToCart:', error);
        res.status(400).json({ msg: "Échec de l'ajout au panier 🫤" });
    }
};

// 🔹 GET : Get User's Cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(404).json({ msg: 'Panier vide 😿' });
        }

        res.status(200).json({ msg: 'Panier récupéré avec succès 🫡', cart });
    } catch (error) {
        console.error('❌ Erreur getCart:', error);
        res.status(400).json({ msg: "Échec de récupération du panier" });
    }
};

// 🔹 PUT : Update a Cart Item
exports.updateCartItem = async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ msg: 'Panier non trouvé 🙁' });
        }

        const item = cart.items.find(item => item.product.toString() === itemId);
        if (!item) {
            return res.status(404).json({ msg: 'Article introuvable dans le panier 🤷‍♂️' });
        }

        item.quantity = parseInt(quantity);

        const totalAmount = await Promise.all(
            cart.items.map(async (item) => {
                const product = await Product.findById(item.product);
                return product.price * item.quantity;
            })
        );

        cart.total = totalAmount.reduce((acc, curr) => acc + curr, 0);

        await cart.save();
        res.status(200).json({ msg: 'Quantité mise à jour avec succès 🫡', cart });
    } catch (error) {
        console.error('❌ Erreur updateCartItem:', error);
        res.status(400).json({ msg: "Impossible de mettre à jour l'article 🫤" });
    }
};

// 🔹 DELETE : Remove an Item from Cart
exports.removeCartItem = async (req, res) => {
    const { itemId } = req.params;
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ msg: 'Panier non trouvé 🙁' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== itemId);

        const totalAmount = await Promise.all(
            cart.items.map(async (item) => {
                const product = await Product.findById(item.product);
                return product.price * item.quantity;
            })
        );

        cart.total = totalAmount.reduce((acc, curr) => acc + curr, 0);

        await cart.save();

        if (cart.items.length === 0) {
            return res.status(200).json({ msg: 'Le panier est maintenant vide 🧹' });
        }

        res.status(200).json({ msg: 'Article supprimé avec succès 🫡', cart });
    } catch (error) {
        console.error('❌ Erreur removeCartItem:', error);
        res.status(400).json({ msg: "Échec de suppression de l'article 🫤" });
    }
};

// 🔹 PUT : Clear Cart
exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ msg: 'Panier non trouvé 🙁' });
        }

        cart.items = [];
        cart.total = 0;

        await cart.save();
        res.status(200).json({ msg: 'Panier vidé avec succès 🧼', cart });
    } catch (error) {
        console.error('❌ Erreur clearCart:', error);
        res.status(400).json({ msg: "Impossible de vider le panier 🫤" });
    }
};
