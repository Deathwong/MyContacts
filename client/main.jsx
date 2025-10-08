// src/main.jsx
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./src/App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contacts from "./pages/Contacts";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="contacts" element={<Contacts />} />
            </Route>
        </Routes>
    </BrowserRouter>
);
