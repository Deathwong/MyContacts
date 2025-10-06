import "dotenv/config.js";
import mongoose from "mongoose";

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);

// Connection
export async function connectDB(){

    console.log("DB_USER:", process.env.DB_USER);
    console.log("DB_PASS:", process.env.DB_PASS);

    try {
        console.log(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}` +
            '@mycontacts.lz9uhbp.mongodb.net/?retryWrites=true&w=majority&appName=myContacts');
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}` +
            '@mycontacts.lz9uhbp.mongodb.net/?retryWrites=true&w=majority&appName=myContacts'
        )
    } catch(err){
        console.error(err.message);
        console.error(err);
    }
}