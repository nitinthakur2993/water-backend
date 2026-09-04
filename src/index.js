// require("dotenv").config({path: '.env'})

import dotenv from "dotenv";
import {app} from "./app.js";
// import mongoose from "mongoose";
// import {DB_NAME} from "./constants.js"
import connectDB from "./db/db.js";

dotenv.config({
    path: '.env'
})


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
  

})
.catch((error) => {
    console.error("MONGO db Connection failed !!! ", error);
})
















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

