const Product = require("../models/product.model");

exports.products_get_all = (req, res, next)=>{
    // res.status(200).json({
    //     message: "Get request /products"
    // })
    Product.find()
            .select("name price _id productImage")
            .then((products)=>{
                // console.log(products);
                if(products.length >0){
                    const response = {
                        count: products.length,
                        products: products.map(doc=>{
                            return{
                                name: doc.name,
                                price: doc.price,
                                _id: doc._id,
                                productImage: doc.productImage,
                                request: {
                                    type: 'GET',
                                    url: "http:localhost:5000/products/"+doc._id
                                }
                            }
                        })
                    }
                    res.status(200).json(response);
                }
                else{
                    res.status(404).json({
                        message: "No records found in your database"
                    })
                }
                
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({error: err});
            })
}

exports.products_create_product = (req, res, next)=>{ //Posting a new data product
    console.log(req.file);
    //Creating a new product instance
    const product = new Product({
        // _id: new Mongoose.Types.ObjectId(),
        name: req.body.name,
        price: Number(req.body.price),
        productImage: req.file.path
    })

    //saving items to MongoDb
    product.save()
        .then(result =>{
            console.log(result);

            res.status(201).json({
                message: "Product created successfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: "http:localhost:5000/products/"+result._id
                    }
                }
            });

        }).catch(err=>{
            console.log(err);
            res.status(500).json({error: err})
        }); 

}

exports.products_get_single = (req, res, next)=>{
    const id = req.params.productId; //getting a single element by ID
    
    Product.findById({_id: id})
            .select('name price _id productImage')
            .then(item =>{
                console.log(item);
                if(item){ //check if document is not null
                    res.status(200).json(item)
                }else{
                    res.status(404).json({
                        message: "No valid entry found for provided ID"
                    });
                }
                
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({error: err});
            })
    // Product.findOne({_id: id}).then((doc)=>{
    //     console.log(doc);
    //     res.status(200).json(doc);
    // }).catch(err =>{
    //     console.log(err);
    //     res.status(500).json({error: err});
    // })
}

exports.products_update = (req, res, next)=>{ //update records
    // res.status(200).json({
    //     message: "Updated product!"
    // })
    const id = req.params.productId;
    const updateOps ={};

    req.body.forEach(ops =>{
        updateOps[ops.propName] = ops.value; 
    })

    // Product.update({_id: id}, {$set: {name: req.body.newName, price: req.body.newPrice}})
    Product.update({_id: id}, {$set: updateOps})
            .then(result=>{
                // console.log(result);
                res.status(200).json({
                    message: "Product details updated",
                    request: {
                        type:"GET",
                        url: "http:localhost:5000/products/"+id
                    
                    }
                });
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            })
            
}

exports.products_delete = (req, res, next)=>{  //delete a product
    const id = req.params.productId;
    // res.status(200).json({
    //     message: "Product deleted!"
    // });
    Product.findByIdAndDelete({_id: id}).then((result) =>{
        if(!result){
            res.status(404).json('Product not found');
        }
        res.status(200).json({
            message: "Product deleted",
            request: {
                type: 'POST',
                url: 'http:localhost:5000/products',
                body: {name: "String", price: "Number"}
            }
        })
    }).catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
}