import  express  from "express";
import {config} from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

config({
    path:"./config/config.env",
})
const app = express();


app.use(express.json());
app.use(express.urlencoded({
    extended:true
}))
app.use(cookieParser());


app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true,
    methods:['GET', 'POST', 'PUT', 'DELETE'],

}))

import course from './routes/courseRoutes.js'
import user from './routes/userRoutes.js'
import {Errormiddleware} from './middlewares/Error.js'
import payment from './routes/Paymentroute.js';
import otherRoutes from './routes/otherRoutes.js';
app.use("/api/v1",course);
app.use("/api/v1",user);
app.use("/api/v1",payment);
app.use("/api/v1",otherRoutes);
app.use(Errormiddleware);

app.get('/',(req,res)=>{res.send(`<h1>Visit site ${process.env.FRONTEND_URL}</h1>`)});

export default app