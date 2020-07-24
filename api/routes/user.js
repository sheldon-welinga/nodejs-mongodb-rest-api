const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");


//user creation or signup
router.post("/signup", (req, res, next)=>{ //409 for confilct or 422 for unaccessible entity
    User.find({email: req.body.email})
        .then( user =>{
            if(user.length>=1){
                res.status(409).json({
                    message: `Email already registered!`
                });
            }else{
                bcrypt.hash(req.body.password, 10, (err, hashedPassword)=>{ //Hashing a password
                    if(err){
                        return res.status(500).json({
                            error: err
                        })
                    }else{
                        const newUser = new User({
                            email: req.body.email,
                            password: hashedPassword
                        });
            
                        newUser.save()
                            .then(user =>{
                                console.log(user);
                                res.status(201).json({
                                    message: `${user.email} registered successfully.`
                                })
                            })
                            .catch(err =>{
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
                })
            }
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            })
        })
});

//delete router
router.delete("/:userId", (req, res, next)=>{
    User.findByIdAndDelete({_id: req.params.userId})
        .then( user =>{
            if(user){
                console.log(user);
                res.status(200).json({
                    message: `${user.email} deleted successfully!`
                })
            }
            else{
                res.status(404).json({
                    error: "Email address not found"
                })
            }
            
        })
        .catch( err =>{
            res.status(500).json({
                error: err
            })
        });
});


module.exports = router;