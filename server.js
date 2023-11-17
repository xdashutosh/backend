import app from "./app.js";
import { connectdb } from "./config/database.js";
import cloudinary from 'cloudinary';
import Razorpay from 'razorpay';
import NodeCron from 'node-cron';
import { Stats } from "./models/Stats.js";
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

NodeCron.schedule("0 0 0 1 * *",async()=>{
    await Stats.create({});
});

const statdoc = async ()=>{
  await Stats.create({});
}
statdoc();

app.listen(process.env.PORT,()=>{
    console.log("server listening on port"+ process.env.PORT);
})