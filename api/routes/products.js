const express  = require("express");
const router = express.Router();
const multer = require("multer") //assist in getting files from form data;
const checkAuth  = require("../middleware/check-auth");
//Product controllers
const ProductControllers = require("../controllers/products.controller");

const storage = multer.diskStorage({  //how to set a more detailed way of storing files
    destination: (req, file, cb)=>{
        cb(null, './uploads/');
    },
    filename: (req, file, cb)=>{
        cb(null,file.originalname);
    }
}) 

// const upload = multer({dest: "uploads/"}); //specifiying a folder to store all uploaded documents/images
const fileFilter = (req, file, cb)=>{
    
    if(file.mimetype === "image/jpeg" || file.mimetype === "images/png" || file.mimetype==="image/jpg"){
        cb(null, true);
    }
    else{
        cb(null, false);   //reject a file
    }
    
};

const upload = multer({storage: storage, limits: {
            fileSize: 1024 * 1024 *5
        },
        fileFilter: fileFilter
    })

//getting all products from our database
router.get("/", ProductControllers.products_get_all);
router.get("/:productId", checkAuth, ProductControllers.products_get_single);
router.post("/", checkAuth ,upload.single('productImage'), ProductControllers.products_create_product);
router.patch("/:productId", checkAuth, ProductControllers.products_update);
router.delete("/:productId", checkAuth, ProductControllers.products_delete);


module.exports = router;