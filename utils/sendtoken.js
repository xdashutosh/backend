export const sendtoken =(res,user,message,statusCode=200)=>{


const token = user.getJWTtoken();
const options = {
    expires:new Date(Date.now()+15*24*6060*1000),
    httpOnly:true,
    secure:true,
    sameSite:"none",
};

res.status(statusCode).cookie("token",token,options).json({
    success:true,
    message,
    user,
    token
})
};