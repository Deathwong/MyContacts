// Importation of Modules
import express from "express";
import authRoutes from "./routes/auth.js"

const app = express();
app.use(express.json());

// Health of the application
app.get("/health", function (req, res){
    res.status(200).json({status: "ok"});
});

app.use("/auth", authRoutes);

export default app;