const bookingService=require("../services/booking.service");

const createBooking=async(req,res,next)=>{
    try{
        const {flightId,seatId}=req.body;

        const userId=req.user.userId;

        const idempotencyKey=req.headers["idempotency-key"];

        if(!idempotencyKey){
            const error =new Error(
                "idempotency-key header is required"
            );
            error.statusCode=400;
            error.code="IDEMPOTENCY_KEY_REQUIRED";
            return next(error);
        }

        if(idempotencyKey.length>100){
            const error = new Error(
                "Idempotency-Key is too long"
            );

            error.statusCode = 400;
            error.code = "INVALID_IDEMPOTENCY_KEY";

            return next(error);
        }

        const result=await bookingService.createBooking({
            userId,
            flightId,
            seatId,
            idempotencyKey
        });

        res.status(result.created ? 201: 200).json({
            success:true,
            data:result.booking
        });
    } catch (error){
        next(error);
    }
};

module.exports={
    createBooking
}