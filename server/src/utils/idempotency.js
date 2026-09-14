const crypto=require("crypto");

const createRequestFingerprint=({flightId,seatId})=>{
    const payload=JSON.stringify({
        flightId:Number(flightId),
        seatId:Number(seatId)
    });
    return crypto
        .createHash("sha256")
        .update(payload)
        .digest("hex");
};

module.exports={
    createRequestFingerprint
};