import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

//const API_URL = "http://localhost:8081/api/services";
// const AUTH_URL = "http://localhost:8081/api/auth/login";
const API_URL = "https://spring.app.aletcloud.com/api/services";
const AUTH_URL = "https://spring.app.aletcloud.com/api/auth/login";

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 40px', backgroundColor: '#2c3e50', color: '#fff' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}>✨ የክላውድ ጽዳት</Link>
          <Link to="/admin" style={{ color: '#ecf0f1', textDecoration: 'none', border: '1px solid #fff', padding: '5px 15px', borderRadius: '4px' }}>🛡️ Admin Dashboard</Link>
        </nav>

        <Routes>
          <Route path="/" element={<UserPage />} />
          <Route path="/admin" element={<AdminProtectedRoute />} />
        </Routes>
      </div>
    </Router>
  );
}

// === 🔒 የመግቢያ ቁጥጥር (Protected Route & Login Page) ===
function AdminProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("adminToken") ? true : false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        setIsAuthenticated(true);
      } else {
        setError(data.message);
      }
    })
    .catch(() => setError("ከሰርቨር ጋር መገናኘት አልተቻለም!"));
  };

  if (isAuthenticated) {
    return <AdminPage onLogout={() => { localStorage.removeItem("adminToken"); setIsAuthenticated(false); }} />;
  }

  return (
    <div style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
      <form onSubmit={handleLogin} style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px' }}>🛡️ የAdmin መግቢያ</h2>
        {error && <p style={{ color: 'red', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#34495e' }}>የተጠቃሚ ስም (Username)</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#34495e' }}>የይለፍ ቃል (Password)</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>ግባ (Login)</button>
      </form>
    </div>
  );
}

// === 🛒 የደንበኞች ገጽ (User Page) ===
function UserPage() {
  const [services, setServices] = useState([]);
  useEffect(() => { fetch(API_URL).then(res => res.json()).then(data => setServices(data)); }, []);

  return (
    <div style={{ padding: '40px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#2c3e50' }}>እንኳን ደህና መጡ!</h1>
        <p style={{ color: '#7f8c8d' }}>የሚፈልጉትን የጽዳት አይነት መርጠው በጥቂት ሰከንዶች ውስጥ ቦታ ያስይዙ</p>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto' }}>
        {services.map(s => (
          <div key={s.id} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <h3>{s.serviceName}</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2ecc71' }}>{s.price} ETB</p>
            <p style={{ color: '#95a5a6' }}>⏱️ ቆይታ: {s.duration}</p>
            <button style={{ width: '100%', padding: '10px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '15px' }}>Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// === 🛡️ የአስተዳዳሪ ገጽ (Admin Page - ADD, EDIT, DELETE) ===
function AdminPage({ onLogout }) {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ id: null, serviceName: '', price: '', duration: '', available: true });

  const refresh = () => fetch(API_URL).then(res => res.json()).then(data => setServices(data));
  useEffect(() => { refresh(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = form.id ? "PUT" : "POST";
    const url = form.id ? `${API_URL}/${form.id}` : API_URL;

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    }).then(() => {
      setForm({ id: null, serviceName: '', price: '', duration: '', available: true });
      refresh();
    });
  };

  const handleEdit = (s) => setForm(s);

  const handleDelete = (id) => {
    if (window.confirm("ይህንን አገልግሎት በእርግጥ ማጥፋት ይፈልጋሉ?")) {
      fetch(`${API_URL}/${id}`, { method: "DELETE" }).then(() => refresh());
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>🛡️ የአስተዳዳሪ መቆጣጠሪያ (Admin Dashboard)</h2>
        <button onClick={onLogout} style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>ውጣ (Logout)</button>
      </div>
      
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
        <h3>{form.id ? "✏️ አገልግሎት ማስተካከያ" : "➕ አዲስ አገልግሎት መጨመሪያ"}</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input placeholder="የአገልግሎት ስም" value={form.serviceName} onChange={e => setForm({...form, serviceName: e.target.value})} required style={{ flex: 2, padding: '10px' }} />
          <input placeholder="ዋጋ (ETB)" type="number" value={form.price} onChange={e => setForm({...form, price: parseFloat(e.target.value)})} required style={{ flex: 1, padding: '10px' }} />
          <input placeholder="የቆይታ ጊዜ" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} required style={{ flex: 1, padding: '10px' }} />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {form.id ? "አድስ" : "ጨምር"}
          </button>
        </div>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <thead>
          <tr style={{ backgroundColor: '#34495e', color: '#fff', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>የአገልግሎት ስም</th>
            <th style={{ padding: '12px' }}>ዋጋ</th>
            <th style={{ padding: '12px' }}>ቆይታ</th>
            <th style={{ padding: '12px' }}>ተግባር</th>
          </tr>
        </thead>
        <tbody>
          {services.map(s => (
            <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{s.serviceName}</td>
              <td style={{ padding: '12px' }}>{s.price} ETB</td>
              <td style={{ padding: '12px' }}>{s.duration} ሰዓት</td>
              <td style={{ padding: '12px' }}>
                <button onClick={() => handleEdit(s)} style={{ marginRight: '10px', backgroundColor: '#f39c12', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(s.id)} style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
