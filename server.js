//require

const express = require ("express");
require ("dotenv").config();
//chemain de la de DB
const connectDB = require('./config/connectDB')
// instances
const app = express();

//middelware
app.use(express.json( ))
// appel de la fonction connectDB
connectDB()
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
  next();
});
//Route pour l'authentification
app.use("/api/auth",require("./routes/auth.route"))

//route pour la manipulation des users 
app.use("/api/user",require("./routes/user.route"))




//route pour la manipulation des produits

app.use("/api/product",require("./routes/product.route"))
// Cart routes
app.use('/api/cart', require('./routes/cart.route'));
// Order routes
app.use('/api/order', require('./routes/order.route'))

//midelware pour render 

app.use((req, res) => {
  res.send("Api is running");
}
);

//Port
const PORT = process.env.PORT || 5000;
//listen
app.listen(PORT,(err)=>{  
      err
        ?console.log(err)
        :console.log(`le serveur est a l'ecoute sur le port ${PORT}`)
}
);

