import { useState, useEffect } from "react";

export default function App() {
  const [form, setForm] = useState({
    name: "",
    session: "",
    hours: "",
    people: "",
    support: ""
  });

  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("dc_sessions");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("dc_sessions", JSON.stringify(entries));
  }, [entries]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const newEntry = { ...form, id: Date.now() };
    setEntries([newEntry, ...entries]);

    setForm({
      name: "",
      session: "",
      hours: "",
      people: "",
      support: ""
    });
  };

  const totalHours = entries.reduce((a, b) => a + Number(b.hours || 0), 0);
  const totalPeople = entries.reduce((a, b) => a + Number(b.people || 0), 0);

  return (
    <div style={{ fontFamily: "Arial", maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h1>Digital Champion Tracker</h1>

      <div style={{ padding: 10, border: "1px solid #ccc", marginBottom: 20 }}>
        <h2>Log Session</h2>

        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <br /><br />

        <input name="session" placeholder="Session" value={form.session} onChange={handleChange} />
        <br /><br />

        <input name="hours" type="number" placeholder="Hours" value={form.hours} onChange={handleChange} />
        <br /><br />

        <input name="people" type="number" placeholder="People supported" value={form.people} onChange={handleChange} />
        <br /><br />

        <textarea
          name="support"
          placeholder="What did you help with?"
          value={form.support}
          onChange={handleChange}
        />
        <br /><br />

        <button onClick={handleSubmit}>Save</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h2>Dashboard</h2>
        <p>Total sessions: {entries.length}</p>
        <p>Total hours: {totalHours}</p>
        <p>Total people supported: {totalPeople}</p>
      </div>

      {entries.map((e) => (
        <div key={e.id} style={{ border: "1px solid #ddd", marginBottom: 10, padding: 10 }}>
          <strong>{e.name}</strong> — {e.session}
          <p>{e.hours} hours | {e.people} people</p>
          <p>{e.support}</p>
        </div>
      ))}
    </div>
  );
}
