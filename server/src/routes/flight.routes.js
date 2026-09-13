const express=require("express");

const router=express.Router();

router.get("/",(req,res)=>{
    res.json({
        message:"Get All flights"
    });
});

router.get("/:id",(req,res)=>{
    res.json({
        message:"Create flight"
    });
});

router.post("/",(req,res)=>{
    res.json({
        message:"Create flight"
    });
});

module.exports=router;