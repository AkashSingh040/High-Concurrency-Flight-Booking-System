const request=new Map();

const WINDOW_MS=60*1000;
const MAX_REQUEST=100;

const rateLimiter=(req,res,next)=>{

    const userId=req.user.userId;

    const now=Date.now();

    let record=request.get(userId);

    if(!record || now - record.startTime >=WINDOW_MS){

        record={
            count:0,
            startTime:now
        };

        request.set(userId,record);
    }

    record.count++;
    
    if(record.count>MAX_REQUEST){
        return res.status(429).json({
            success:false,
            error:{
                code:"RATE_LIMIT_EXCEEDED",
                message:"Too many requests"
            }
        });
    }

    res.setHeader("X-RateLimit-Limt",Math.max(0,MAX_REQUEST-record.count));
    next();
};

module.exports=rateLimiter;