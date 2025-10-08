// client/src/pages/Contacts.js
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Create form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");

    // Edit state: id currently being edited and its draft
    const [editId, setEditId] = useState(null);
    const [editDraft, setEditDraft] = useState({ firstName: "", lastName: "", phone: "" });

    const loadContacts = async () => {
        try {
            setLoading(true);
            setError("");
            const { data } = await api.get("/contacts");
            setContacts(data.data || []);
        } catch (e) {
            setError("Unauthorized or failed to load contacts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadContacts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const resetCreateForm = () => {
        setFirstName("");
        setLastName("");
        setPhone("");
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            setError("");
            const body = { firstName, lastName, phone };
            const { data } = await api.post("/contacts", body);
            const created = data?.data;
            if (created) {
                setContacts((prev) => [created, ...prev]);
                resetCreateForm();
            } else {
                await loadContacts();
            }
        } catch (e) {
            setError(e.response?.data?.message || "Failed to create contact");
        }
    };

    const startEdit = (c) => {
        setEditId(c._id);
        setEditDraft({ firstName: c.firstName || "", lastName: c.lastName || "", phone: c.phone || "" });
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditDraft({ firstName: "", lastName: "", phone: "" });
    };

    const saveEdit = async (id) => {
        try {
            setError("");
            const patch = {};
            ["firstName", "lastName", "phone"].forEach((k) => {
                if (editDraft[k] !== undefined) patch[k] = editDraft[k];
            });
            const { data } = await api.patch(`/contacts/${id}`, patch);
            const updated = data?.data;
            if (updated) {
                setContacts((prev) => prev.map((c) => (c._id === id ? updated : c)));
            } else {
                await loadContacts();
            }
            cancelEdit();
        } catch (e) {
            setError(e.response?.data?.message || "Failed to update contact");
        }
    };

    const remove = async (id) => {
        try {
            setError("");
            await api.delete(`/contacts/${id}`);
            setContacts((prev) => prev.filter((c) => c._id !== id));
            if (editId === id) cancelEdit();
        } catch (e) {
            setError(e.response?.data?.message || "Failed to delete contact");
        }
    };

    return (
        <div style={{ maxWidth: 500, margin: "20px auto", padding: 12 }}>
            <h2>Vos Contacts</h2>

            {error && (
                <div style={{ color: "#b00020", marginBottom: 10 }}>{error}</div>
            )}

            <form onSubmit={handleCreate} style={{ display: "grid", gap: 8, marginBottom: 20 }}>
                <strong>Créer un contact</strong>
                <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Prénom"
                    required
                />
                <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Nom"
                    required
                />
                <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Téléphone"
                    required
                />
                <button type="submit">Ajouter</button>
            </form>

            {loading ? (
                <p>Chargement…</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {contacts.map((c) => (
                        <li key={c._id} style={{ border: "1px solid #ddd", padding: 8, marginBottom: 8 }}>
                            {editId === c._id ? (
                                <div style={{ display: "grid", gap: 6 }}>
                                    <input
                                        value={editDraft.firstName}
                                        onChange={(e) => setEditDraft({ ...editDraft, firstName: e.target.value })}
                                        placeholder="Prénom"
                                    />
                                    <input
                                        value={editDraft.lastName}
                                        onChange={(e) => setEditDraft({ ...editDraft, lastName: e.target.value })}
                                        placeholder="Nom"
                                    />
                                    <input
                                        value={editDraft.phone}
                                        onChange={(e) => setEditDraft({ ...editDraft, phone: e.target.value })}
                                        placeholder="Téléphone"
                                    />
                                    <div>
                                        <button type="button" onClick={() => saveEdit(c._id)} style={{ marginRight: 8 }}>
                                            Enregistrer
                                        </button>
                                        <button type="button" onClick={cancelEdit}>Annuler</button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span>
                                        {c.firstName} {c.lastName} — {c.phone}
                                    </span>
                                    <span>
                                        <button type="button" onClick={() => startEdit(c)} style={{ marginRight: 8 }}>
                                            Modifier
                                        </button>
                                        <button type="button" onClick={() => remove(c._id)}>Supprimer</button>
                                    </span>
                                </div>
                            )}
                        </li>
                    ))}
                    {contacts.length === 0 && <li>Aucun contact pour le moment.</li>}
                </ul>
            )}
        </div>
    );
}
