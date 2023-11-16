import app from "./app.js";
import { connectdb } from "./config/Database.js";
import cloudinary from 'cloudinary';
import Razorpay from 'razorpay';
connectdb();
          
cloudinary.v2.config({ 
  cloud_name: 'ddvlumoox', 
  api_key: '759862531131127', 
  api_secret: '5xB9dUmwPJsdb7S5SUSGltgqNqg' 
});


export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});


app.listen(process.env.PORT,()=>{
    console.log("server listening on port"+ process.env.PORT);
})