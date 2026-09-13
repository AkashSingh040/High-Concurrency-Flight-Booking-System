const express=require("express");

const {register,login}=require("../controllers/auth.controller");
const authenticate = require("../middleware/auth.middleware");


const router=express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/profile", authenticate, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

module.exports=router;