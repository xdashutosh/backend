import { User } from "../models/User.js";

export const getAllUsers = async(req,res)=>{
    
 const users = await User.find();

    res.status(200).json({
        success:true,
        users
    })
}