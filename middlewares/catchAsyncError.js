export const catchAsyncError = (passedfunction)=>{
    //a function returning a function write like this
    return (req,res,next)=>{
Promise.resolve(passedfunction(req,res,next)).catch(next);
    }
}