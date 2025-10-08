// client/src/App.js
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contacts from "./pages/Contacts";

const Protected = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" replace />;
};

function NavBar() {
    useLocation();
    const navigate = useNavigate();
    const isAuthed = !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };

    return (
        <nav style={{ margin: 10, display: "flex", gap: 8, alignItems: "center" }}>
            {!isAuthed && <Link to="/login">Login</Link>}
            {!isAuthed && <span>|</span>}
            {!isAuthed && <Link to="/register">Register</Link>}
            {isAuthed && <Link to="/contacts">Contacts</Link>}
            {isAuthed && (
                <button type="button" onClick={handleLogout} style={{ marginLeft: 8 }}>
                    Déconnexion
                </button>
            )}
        </nav>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <NavBar />

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/contacts"
                    element={
                        <Protected>
                            <Contacts />
                        </Protected>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
