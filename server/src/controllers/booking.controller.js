const bookingService=require("../services/booking.service");

const createBooking=async(req,res,next)=>{
    try{
        const {flightId,seatId}=req.body;

        const userId=req.user.userId;

        const booking=await bookingService.createBooking({
            userId,
            flightId,
            seatId
        });

        res.status(201).json({
            success:true,
            data:booking
        });
    } catch (error){
        next(error);
    }
};

module.exports={
    createBooking
}