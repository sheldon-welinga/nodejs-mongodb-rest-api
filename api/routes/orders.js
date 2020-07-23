const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/orders.model");
const Product = require("../models/product.model");

router.get("/", (req, res, next)=>{
    // res.status(200).json({
    //     message: "Orders were fetched"
    // });
    Order.find()
        .select("product quantity _id")
        .populate('product', "name")
        .then(order =>{
            console.log(order)
            if(order.length>0){
                res.status(200).json({
                    count: order.length,
                    orders: order.map(doc =>{
                        return{
                            _id: doc._id,
                            product: doc.product,
                            quantity: doc.quantity,
                            request: {
                                type:  'GET',
                                url: "http:localhost:5000/orders/"+doc._id
                            }
                        }
                    })
                });
            }else{
                res.status(404).json({
                    message: "No orders were found in the database"
                })
            }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.post("/", (req, res, next)=>{
    Product.findById(req.body.productId)
            .then( product =>{
                if(!product){
                    return res.status(404).json({
                        message: "Product not found"
                    })
                }
                const order = new Order({
                    // orderId: req.body.orderId,
                    quantity: req.body.quantity,
                    product: req.body.productId
                })
            
                order.save()
                        .then(result =>{
                            console.log(result);
                            res.status(201).json({
                                message: "Your order has been stored",
                                createdOrder: {
                                    _id: result._id,
                                    product: result.product,
                                    quantity: result.quantity
                                },
                                request: {
                                    type: 'GET',
                                    url: "http://localhost:5000/orders/"+result._id
                                }
                            });
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
            })
            .catch( err =>{
                res.status(404).json({
                    message: "Product not Found",
                    error: err
                })
            })
   

    // res.status(201).json({
    //     message: "Your order was created",
    //     createdOrder: order
    // })
});

router.get("/:orderId", (req, res, next)=>{
    const id = req.params.orderId;
    Order.findById({_id: id})
        .populate("product")
        .then( order =>{
            res.status(200).json({
                order: order,
                request: {
                    type: "GET",
                    description: "GET_ALL_ORDERS",
                    url: "http://localhost:5000/orders"
                }
            })
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            })
        })
});

router.delete("/:orderId", (req, res, next)=>{
    const id = req.params.orderId;
    Order.findByIdAndDelete({_id: id })
            .then( result =>{
                if(!result){
                    res.status(404).json("Order not found");
                }
                res.status(200).json({
                    message: "Order deleted",
                    request: {
                        type: "POST",
                        url: "http://localhost:5000/orders",
                        body: {productId: 'ID', quantity: "Number"}
                    }
                })
            })
            .catch(err =>{
                res.status(500).json({
                    error: err
                })
            })
    // res.status(200).json({
    //     message: "Order deleted",
    //     orderId: req.params.orderId
    // })
})


module.exports = router;