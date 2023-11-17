import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import { Stats } from "../models/Stats.js";
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


export const dashstats = catchAsyncError(async(req,res,next)=>{

const stats = await Stats.find({}).sort({createdAt:"desc"}).limit(12);

const statsdata = [];
const reqsize = 12-stats.length;

for (let i=0; i<stats.length; i++)
{
statsdata.unshift(stats[i]);
}
for (let i=0; i<reqsize; i++)
{
statsdata.unshift({users:0,views:0,subscriptions:0,createdAt:Date.now()});
}


const usersCount = statsdata[11].users;
const viewCount = statsdata[11].views;
const subscriptionsCount = statsdata[11].subscriptions;

let userProfit = true,viewsprofit =true,subscriptionprofit=true;
let userPercentage = true,viewsPercentage =true,subscriptionPercentage=true;

if(statsdata[10].users ===0) userPercentage =usersCount*100;
if(statsdata[10].views===0) viewsPercentage =viewCount*100;
if(statsdata[10].subscriptions ===0) subscriptionPercentage =subscriptionsCount*100;

else{
    const diff ={
        users:statsdata[11].users-statsdata[10].users,
        views:statsdata[11].views-statsdata[10].views,
        subscriptions:statsdata[11].subscriptions-statsdata[10].subscriptions,
    };

    userPercentage=(diff.users/statsdata[10].users)*100;
    viewsPercentage=(diff.views/statsdata[10].views)*100;
    subscriptionPercentage=(diff.subscriptions/statsdata[10].subscriptions)*100;
    if(userPercentage<0) userProfit = false;
    if(viewsPercentage<0) viewsprofit = false;
    if(subscriptionPercentage<0) subscriptionprofit = false;
}
    res.json({
        success:true,
        usersCount,
        viewCount,
        subscriptionsCount,
        userPercentage,
        viewsPercentage,
        userProfit,
        viewsprofit,
        subscriptionprofit,
        stats:statsdata,
    })
});