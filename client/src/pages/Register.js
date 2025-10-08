// client/src/pages/Register.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/auth/register", { email, password });
            setMsg("Account created successfully!");
            setTimeout(() => navigate("/login"), 1000);
        } catch (err) {
            setMsg("Registration failed: " + err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button>Register</button>
            {msg && <p>{msg}</p>}
        </form>
    );
}
