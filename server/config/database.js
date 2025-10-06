import "dotenv/config.js";
import mongoose from "mongoose";

// Connection
export async function connectDB(){

    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}` +
            '@mycontacts.lz9uhbp.mongodb.net/?retryWrites=true&w=majority&appName=myContacts'
        )
    } catch(err){
        console.error(err.message);
        console.error(err);
    }
}