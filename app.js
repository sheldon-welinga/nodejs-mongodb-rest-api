const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");


//Connect to a database
const uri = process.env.ATLAS_URI || "mongodb+srv://prince-shop:prince-shop@prince-shop.bxnss.gcp.mongodb.net/prince-shop?retryWrites=true&w=majority"
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});



app.use(morgan('dev')); //To log something to the console showing the path and action after a request have been made
// app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//preventing cors errors
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    // res.header("Access-Control-Allow-Headers", '*');    
    res.header("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if(res.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({});
    }
    next();
});


//Routes Middleware
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);


//Handling errors
app.use((req, res, next)=>{
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
})




module.exports = app;