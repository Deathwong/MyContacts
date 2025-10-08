// client/src/pages/Contacts.js
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Contacts() {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        api.get("/contacts")
            .then(({ data }) => setContacts(data.data))
            .catch(() => alert("Unauthorized or failed to load contacts"));
    }, []);

    return (
        <div>
            <h2>Your Contacts</h2>
            <ul>
                {contacts.map((c) => (
                    <li key={c._id}>
                        {c.firstName} {c.lastName} — {c.phone}
                    </li>
                ))}
            </ul>
        </div>
    );
}
