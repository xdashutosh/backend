import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";

export const contactus = catchAsyncError(async(req,res,next)=>{
    const{name,email,message} = req.body;

const to = "ashuchaudhary6969@gmail.com";
const subject = "contact from eduorage";
const text = `I am ${name} and my email is ${email} \n ${message}`

await sendEmail(to, subject, text);

    res.json({
        success:true,
        message:`you got a mail from ${name}`
    })
});


export const courseReq = catchAsyncError(async(req,res,next)=>{
    const{name,email,coursedetail} = req.body;

    const to = "ashuchaudhary6969@gmail.com";
    const subject = "Course request";
    const text = `I am ${name} and my email is ${email} \n ${coursedetail}`
    
    await sendEmail(to, subject, text);
    
  

    res.json({
        success:true,
        message:`you got a mail from ${name}`
    })
});


export const dashstats = catchAsyncError((req,res,next)=>{
    const{name,email,message} = req.body;

    res.json({
        success:true,
        message:`you got a mail from ${name}`
    })
});