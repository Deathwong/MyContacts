// Importation of Modules
import express from "express";
import authRoutes from "./routes/auth.js"
import cookieParser from "cookie-parser";
import contactRoutes from "./routes/contact.js";
import {auth} from "./middleware/auth.js";
import swaggerUi from "swagger-ui-express";
import {specs} from "./config/swagger.js"
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
}));
app.use(cookieParser());

// Health of the application
app.get("/health", function (req, res){
    res.status(200).json({status: "ok"});
});

app.use("/auth", authRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

app.use("/", auth, contactRoutes);

export default app;