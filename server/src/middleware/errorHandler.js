const errorHandler=(err,req,res,next)=>{
    console.error(err);

    res.status(err.statusCode || 500).json({
        success:false,
        error:{
            code:err.code || "INTERNAL_SERVER_ERROR",
            message:err.message || "Internal Server Error"
        }
    });
};

module.exports=errorHandler;