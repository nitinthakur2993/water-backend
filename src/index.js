// require("dotenv").config({path: '.env'})

import dotenv from "dotenv";
// import mongoose from "mongoose";
// import {DB_NAME} from "./constants.js"
import connectDB from "./db/db.js";

dotenv.config({
    path: '.env'
})






connectDB();
















// ( async () => {
// try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     console.log(` \n MongoDB connected !! DB HOST: $ {
//         connectionInstance.connection.host} \n `);

// } catch(error) {
//     console.error("ERROR: ", error)
//     process.exit(1);
// }
// })

