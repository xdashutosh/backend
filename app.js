import  express  from "express";
import {config} from "dotenv";
import cookieParser from "cookie-parser";

config({
    path:"./config/config.env",
})
const app = express();


app.use(express.json());
app.use(express.urlencoded({
    extended:true
}))
app.use(cookieParser());

import course from './routes/courseRoutes.js'
import user from './routes/userRoutes.js'
import {Errormiddleware} from './middlewares/Error.js'
app.use("/api/v1",course);
app.use("/api/v1",user);
app.use(Errormiddleware);

export default app