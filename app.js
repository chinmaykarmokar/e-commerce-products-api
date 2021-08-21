const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = "mongodb://127.0.0.1:27017/products_db";

const app = express();

app.use(express.json());

// GET list of products added.

app.get('/listOfProducts', (req,res) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;

        const database = db.db("products_db");

        database.collection("products").find({}).toArray((err, result) => {
            if (err) throw err;

            res.send(result);
        })
    })
})

// POST new products.

app.post('/listOfProducts', (req,res) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;

        const database = db.db("products_db");

        const productList = req.body;

        database.collection("products").insertOne(productList, (err, result) => {
            if (err) throw err;

            res.send(result);
        })
    })
})

// PUT (update) existing products.

app.put('/listOfProducts/:id', (req,res) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;

        const database = db.db("products_db");

        const itemToBeUpdated = {_id: ObjectId(req.params.id)};

        const updatedProductList = {$set: req.body};

        database.collection("products").updateOne(itemToBeUpdated, updatedProductList, (err, result) => {
            if (err) throw err;

            res.send(result);
        })
    })
})

// DELETE Product from the list.

app.delete('/listOfProducts/:id', (req,res) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;

        const database = db.db("products_db");

        const itemTobeDeleted = {_id: ObjectId(req.params.id)};

        database.collection("products").deleteOne(itemTobeDeleted, (err, result) => {
            if (err) throw err;

            res.send(result);
        })
    })
})

// POST products to the wishlist:

app.post('/wishlist/:user/:id', (req,res) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;

        const database = db.db("products_db");

        database.collection("products").find({_id: ObjectId(req.params.id)}).toArray((err, result) => {
            if (err) throw err;
            console.log(result)

            delete result[0]["originalQuantity"];
            delete result[0]["newQuantity"];

            const addToWishlist = {user: req.params.user, remindToBuyOn: req.body.remindToBuyOn, wishlist_items: result};

            database.collection("wishlist").insertOne(addToWishlist, (err, result) => {
                if (err) throw err;

                res.send(result)
            })
        })
    })
})

// GET products from the wishlist.

app.get('/wishlist/:user', (req,res) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;

        const database = db.db("products_db");

        database.collection("wishlist").find({user: req.params.user}).toArray((err, result) => {
            if (err) throw err;

            res.send(result);
        })
    })
})

// PUT (update) wishlist products

app.put('/wishlist/:user/:id', (req,res) => {
    MongoClient.connect(url, (err,db) => {
        if (err) throw err;

        const database = db.db("products_db");

        const wishListItemToBeUpdated = {_id: ObjectId(req.params.id), user: req.params.user};

        const updatedWishList = {$set: req.body};

        database.collection("wishlist").updateOne(wishListItemToBeUpdated, updatedWishList, (err, result) => {
            if (err) throw err;

            res.send(result);
        })
    })
})

// DELETE products from wishlist

app.delete('/wishlist/:user/:id', (req,res) => {
    MongoClient.connect(url, (err,db) => {
        if (err) throw err;

        const database = db.db("products_db");

        const deleteWishListItem = {_id: ObjectId(req.params.id)};

        database.collection("wishlist").deleteOne(deleteWishListItem, (err, result) => {
            if (err) throw err;

            res.send(result);
        })
    })
})

// POST products for buying.

app.post('/buy/:user/:id', (req,res) => {
    MongoClient.connect(url, (err,db) => {
        if (err) throw err;

        const database = db.db("products_db");

        database.collection("products").find({_id: ObjectId(req.params.id)}).toArray((err, result) => {
            if (err) throw err;

            if (result[0].newQuantity == 0) {
                res.send({
                    warning: "Product is out of stock."
                })
            }

            else {
                delete result[0]["originalQuantity"];
                delete result[0]["newQuantity"];

                const addToItemBought = {user: req.params.user, quantity: req.body.quantity, items_bought: result};

                database.collection("item_bought").insertOne(addToItemBought, (err, result) => {
                    if (err) throw err;
                    console.log(result);

                    database.collection("products").find({_id: ObjectId(req.params.id)}).toArray((err, result) => {
                        if (err) throw err;

                        const productToBeUpdated = {_id: ObjectId(req.params.id)};

                        const newProductQuantity = {$set: {newQuantity: result[0].newQuantity - req.body.quantity}}
            
                        database.collection("products").updateOne(productToBeUpdated, newProductQuantity, (err, result) => {
                            if (err) throw err;
                
                            console.log(result);
                        })
                    })

                    res.send(result)
                })
            }
        })
    })
})

app.get('/buy/:user', (req,res) => {
    MongoClient.connect(url, (err,db) => {
        if (err) throw err;

        const database = db.db("products_db");

        database.collection("item_bought").find({user: req.params.user}).toArray((err, result) => {
            if (err) throw err;

            res.send(result);
        })
    })
})

app.put('/buy/:user/:id', (req,res) => {
    MongoClient.connect(url, (err,db) => {
        if (err) throw err;

        const database = db.db("products_db");

        const productOrderToBeUpdated = {_id: ObjectId(req.params.id), user: req.params.user};
        const updatedQuantity = {$set: req.body};

        database.collection("item_bought").find({user: req.params.user, _id: ObjectId(req.params.id)}).toArray((err, resultBeforeUpdate) => {
            if (err) throw err;
            console.log(resultBeforeUpdate);

            database.collection("item_bought").updateOne(productOrderToBeUpdated, updatedQuantity, (err, resultAfterUpdate) => {
                if (err) throw err;
    
                database.collection("item_bought").find({user: req.params.user, _id: ObjectId(req.params.id)}).toArray((err, resultUpdated) => {
                    if (err) throw err;
        
                    console.log(resultUpdated);

                    if (resultBeforeUpdate[0].quantity > resultUpdated[0].quantity) {
                        let changeInQuantity =  resultBeforeUpdate[0].quantity - resultUpdated[0].quantity;
                        
                        console.log(changeInQuantity);

                        database.collection("products").find({_id: ObjectId(resultUpdated[0].items_bought[0]._id)}).toArray((err, result) => {
                            if (err) throw err;

                            console.log(result[0]);

                            const productToBeUpdated = {_id: ObjectId(resultUpdated[0].items_bought[0]._id)};
                            const newProductQuantity = {$set: {newQuantity: result[0].newQuantity + changeInQuantity}};
                
                            database.collection("products").updateOne(productToBeUpdated, newProductQuantity, (err, result) => {
                                if (err) throw err;
                    
                                console.log(result);
                            })
                        })
                    }

                    if (resultBeforeUpdate[0].quantity < resultUpdated[0].quantity) {
                        let changeInQuantity =  resultUpdated[0].quantity - resultBeforeUpdate[0].quantity;
                        console.log(changeInQuantity);

                        database.collection("products").find({_id: ObjectId(resultUpdated[0].items_bought[0]._id)}).toArray((err, result) => {
                            if (err) throw err;

                            console.log(result);

                            const productToBeUpdated = {_id: ObjectId(resultUpdated[0].items_bought[0]._id)};

                            let noOfProducts = Math.max(0, result[0].newQuantity - changeInQuantity);

                            if (resultUpdated.quantity > result[0].originalQuantity) {
                                res.send({
                                    warning: "Product not found"
                                })
                            } 

                            else {
                                const newProductQuantity = {$set: {newQuantity: noOfProducts}}

                                database.collection("products").updateOne(productToBeUpdated, newProductQuantity, (err, result) => {
                                    if (err) throw err;
                        
                                    console.log(result);
                                }) 
                            }
                        })
                    }
                })
    
                res.send(resultAfterUpdate);
            }) 
        })
    })
})

app.delete('/buy/:user/:id', (req,res) => {
    MongoClient.connect(url, (err,db) => {
        if (err) throw err;

        const database = db.db("products_db");

        const deleteOrderItem = {_id: ObjectId(req.params.id)};

        database.collection("item_bought").find({_id: ObjectId(req.params.id), user: req.params.user}).toArray((err, result) => {
            if (err) throw err;

            let quantityOfProductDeletedFromOrder = result[0].quantity;
            console.log(quantityOfProductDeletedFromOrder);

            database.collection("item_bought").deleteOne(deleteOrderItem, (err, resultOfDeletedProduct) => {
                if (err) throw err;

                database.collection("products").find({_id: ObjectId(result[0].items_bought[0]._id)}).toArray((err, quantityOfProduct) => {
                    if (err) throw err;

                    console.log(quantityOfProduct);
        
                    const updateProductQuantity = {_id: ObjectId(result[0].items_bought[0]._id)};
                    const newProductQuantity = {$set: {newQuantity: quantityOfProduct[0].newQuantity + quantityOfProductDeletedFromOrder}}

                    database.collection("products").updateOne(updateProductQuantity, newProductQuantity, (err,result) => {
                        if (err) throw err;
                        console.log(result);
                    })
                })
    
                res.send(resultOfDeletedProduct);
            })
        })
    })
})

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
    if (err) throw err;
    console.log('Server is running on port: ' + port);
})