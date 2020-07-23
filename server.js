const express = require("express");
const PORT = process.env.PORT || 5000;

const app = require("./app");

app.listen(PORT , ()=>{
    console.log("Running on port :"+PORT);
})