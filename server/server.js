import "dotenv/config";
import {connectDB} from "./config/database.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

await connectDB();
app.listen(PORT, function () {
    console.log(`API Launched on port ${PORT}`)
})