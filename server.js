import app from "./app.js";
import { connectdb } from "./config/Database.js";

connectdb();

app.listen(process.env.PORT,()=>{
    console.log("server listening on port"+ process.env.PORT);
})