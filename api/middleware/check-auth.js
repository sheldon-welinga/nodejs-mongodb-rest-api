const jwt = require("jsonwebtoken");

//For adding the token in the header use

/*
    Content-Type: Authorization
    value: Bearer token
*/

module.exports = (req, res, next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1]; //To get the token from the header
        const decoded = jwt.verify(token, "secret");
        req.userData =decoded;
        next();
    }catch(err){
        return res.status(401).json({
            message: "Authorization failed!"
        });
    } 
}

