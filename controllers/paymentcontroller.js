import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { instance } from "../server.js";
import crypto from "crypto";
import { Payment } from "../models/payment.js";

export const Buysub = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user.role === "admin")
    return next(new ErrorHandler("admin dont have to subscribe", 400));

  const subscribe = await instance.subscriptions.create({
    plan_id: process.env.PLAN_ID,
    customer_notify: 1,
    total_count: 12,
  });

  // const url  = subscribe.short_url;
  user.subscription.id = subscribe.id;
  user.subscription.status = subscribe.status;

  await user.save();

  res.json({
    success: true,
    subscriptionId: subscribe.id,
  });
});

export const paymentvarification = catchAsyncError(async (req, res, next) => {
  const { razorpay_payment_id, razorpay_signature, razorpay_subscription_id } =
    req.body;
  const user = await User.findById(req.user._id);

  const subscriptionId = user.subscription.id;
  const genratedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(razorpay_payment_id + "|" + subscriptionId, "utf-8")
    .digest("hex");

  const isAuthentic = genratedSign === razorpay_signature;
  if (!isAuthentic) res.redirect(`${process.env.FRONTEND_URL}/paymentfail`);

  //database comes here
  await Payment.create({
    razorpay_payment_id,
    razorpay_signature,
    razorpay_subscription_id,
  });

user.subscription.status="active";  
  await user.save();

  res.redirect(`${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`)
});


export const cancelSubs = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user._id);
    const subscriptionId = user.subscription.id;

    let refund = false;

    await instance.subscriptions.cancel(subscriptionId);

    const payment = await Payment.findOne({
        razorpay_subscription_id:subscriptionId
    });


    const gap = Date.now()-payment.createdAt;
    const refundtime = 7*24*60*60*1000;
    if (refundtime>gap)
    {
        await instance.payments.refund(payment.razorpay_payment_id);
        refund = true;
    }

    await payment.deleteOne();
    user.subscriptionId = undefined;
    user.subscription.status = undefined;
    await user.save();

    res.json({
        success:true,
        message:refund?"subscription cancel, refund will be send in & days":"subscription cancel, no refund will be sent after 7 days"
    })
})