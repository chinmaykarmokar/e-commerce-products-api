# e-commerce-products-api
Products API for listing products, adding them to wishlist and buying them with MongoDB.

# 1. CRUD for Products:

##### GET Products endpoint: #####
Endpoint: http://localhost:3000/listOfProducts (PORT as per specified).

##### POST new Products endpoint: #####
Endpoint: http://localhost:3000/listOfProducts 
Data in JSON format to be posted: 
```json 
{
    "name": "Product 1",
    "color": "blue",
    "price": 100,
    "originalQunatity": 100,
    "newQuantity": 100,
    "description": "A product of blue color."
}
```

##### PUT (update) existing Product: #####
Endpoint: http://localhost:3000/listOfProducts/6120acc78808c1023d013a9c
(http://localhost:3000/listOfProducts/:id)
Data in JSON:
```json
{
    "price": 150,
    "description": "A product of the color BLUE."
}
```

##### DELETE Product: #####
Endpoint: http://localhost:3000/listOfProducts/61202ad654d911bb7b3c5f98
(http://localhost:3000/listOfProducts/:id)

# 2. CRUD for Wishlist:

##### POST (add) product to wishlist: #####
Endpoint: http://localhost:3000/wishlist/test/6120bb7373688c86910b6c77 
(http://localhost:3000/wishlist/:user/:id) // Use id from **products**.

Adding an extra field of date on which to be reminded:
```json
{
    "remindToBuyOn": "01-10-2021"
}
```

##### GET wishlist products: #####
Endpoint: http://localhost:3000/wishlist/test
(http://localhost:3000/wishlist/:id)

##### PUT (update) wishlist products: #####
Endpoint: http://localhost:3000/wishlist/test/6120bfe03b93563936e763ec
(http://localhost:3000/wishlist/:user/:id) // Use id from **wishlists**. Updating the date:
```json 
{
    "remindToBuyOn": "02-10-2021"
}
```

##### DELETE wishlist products: #####
Endpoint: http://localhost:3000/wishlist/test/6120bf7fce3051bb782a70cb
(http://localhost:3000/wishlist/:user/:id)

# 3. CRUD for buying:

##### POST (buy product): #####
Endpoint: http://localhost:3000/buy/test/6120bb7373688c86910b6c77 // Use id from **products**.
(http://localhost:3000/buy/:user/:id)

Specify the quantity to be bought:
```json
{
    "quantity": 2
}
```
Original products quantity also gets updated on buying the product and specifying the quantity that you want to buy.

##### GET products bought: #####
Endpoint: http://localhost:3000/buy/test
(http://localhost:3000/buy/:user)

##### PUT (update) products_bought: #####
Endpoint: http://localhost:3000/buy/test/6120caa91bed8bffa4dbe0b4 // Use id from **item_bought.**
(http://localhost:3000/buy/:user/:id)

Specify quantity to be updated: 
```json 
{
    "quantity": 3
}
```
Original products quantity also gets updated on updating the quantity of the product that is bought.

##### DELETE item that was bought: #####
Endpoint: http://localhost:3000/buy/test/6120caa91bed8bffa4dbe0b4 // Use id from **item_bought**.
(http://localhost:3000/buy/:user/:id)

Original products quantity gets reset on deleting (cancelling order) the product that you had bought initially.
