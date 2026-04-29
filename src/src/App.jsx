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
  const [view, setView] = useState("form");

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

  const generateFeedback = (entry) => {
    const tips = [];

    if (entry.support.toLowerCase().includes("nhs")) {
      tips.push("Great support with the NHS App — keep building confidence step by step.");
    }

    if (Number(entry.people) > 5) {
      tips.push("High number of people supported — great impact, remember to pace yourself.");
    }

    if (Number(entry.hours) > 3) {
      tips.push("Long session — take breaks and reflect on what worked well.");
    }

    return `Amazing work ${entry.name}!

You supported ${entry.people} people at ${entry.session} for ${entry.hours} hours.

Support given: ${entry.support}

Tips:
- ${tips.length ? tips.join("\n- ") : "Keep going — you're making a real difference in your community!"}`;
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

    setView("dashboard");
  };

  const totalHours = entries.reduce((a, b) => a + Number(b.hours || 0), 0);
  const totalPeople = entries.reduce((a, b) => a + Number(b.people || 0), 0);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20, fontFamily: "Arial" }}>
      
      <h1>Digital Champion Tracker</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setView("form")}>New Session</button>
        <button onClick={() => setView("dashboard")} style={{ marginLeft: 10 }}>
          Dashboard
        </button>
      </div>

      {/* FORM */}
      {view === "form" && (
        <div style={{ padding: 20, border: "1px solid #ccc" }}>
          <h2>Log Session</h2>

          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
          />
          <br /><br />

          <input
            name="session"
            placeholder="Session / Location"
            value={form.session}
            onChange={handleChange}
          />
          <br /><br />

          <input
            name="hours"
            type="number"
            placeholder="Hours"
            value={form.hours}
            onChange={handleChange}
          />
          <br /><br />

          <input
            name="people"
            type="number"
            placeholder="People Supported"
            value={form.people}
            onChange={handleChange}
          />
          <br /><br />

          <textarea
            name="support"
            placeholder="What did you support people with?"
            value={form.support}
            onChange={handleChange}
          />
          <br /><br />

          <button onClick={handleSubmit}>Save Session</button>
        </div>
      )}

      {/* DASHBOARD */}
      {view === "dashboard" && (
        <div>
          <h2>Impact Dashboard</h2>

          <div style={{ padding: 10, border: "1px solid #ccc" }}>
            <p>Total Sessions: {entries.length}</p>
            <p>Total Hours: {totalHours}</p>
            <p>Total People Supported: {totalPeople}</p>
          </div>

          <br />

          {entries.map((e) => (
            <div key={e.id} style={{ border: "1px solid #ddd", marginBottom: 10, padding: 10 }}>
              <strong>{e.name} — {e.session}</strong>
              <p>{e.hours} hours | {e.people} people</p>
              <p>{e.support}</p>

              <pre style={{ whiteSpace: "pre-wrap", background: "#f5f5f5", padding: 10 }}>
                {generateFeedback(e)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
