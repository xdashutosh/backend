import app from "./app.js";
import { connectdb } from "./config/Database.js";
import cloudinary from 'cloudinary';
connectdb();
          
cloudinary.v2.config({ 
  cloud_name: 'ddvlumoox', 
  api_key: '759862531131127', 
  api_secret: '5xB9dUmwPJsdb7S5SUSGltgqNqg' 
});
app.listen(process.env.PORT,()=>{
    console.log("server listening on port"+ process.env.PORT);
})