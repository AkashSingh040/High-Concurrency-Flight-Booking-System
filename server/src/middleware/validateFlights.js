const validateFlight=(req,res,next)=>{
    const {airline, from, to ,price}=req.body;

    if(!airline || ! from || !to){
        return res.status(400).json({
            success:false,
            error:{
                code:"VALIDATION_ERROR",
                message:"airline, from and to are required"
            }
        });
    }

    if(typeof price!=="number" || price<=0){
        return res.status(400).json({
            success:false,
            error:{
                code:"VALIDATION_ERROR",
                message:"price must be a positive number"
            }
        });
    }

    next();
};

module.exports=validateFlight;