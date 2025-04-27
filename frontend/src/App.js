import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000); 
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5050/scrape");
      setHeadlines(res.data);
      showAlert("Headlines fetched successfully!");
    } catch (err) {
      showAlert("Failed to fetch headlines: " + err.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (cred) => {
    setUser(cred);
    showAlert("Login successful!");
    console.log(cred);
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    setHeadlines([]); 
    showAlert("Logged out successfully", "warning");
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="container mt-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>📰 News Scraper Portal</h2>
          {user && (
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>

        {alert && (
          <div className={`alert alert-${alert.type}`} role="alert">
            {alert.message}
          </div>
        )}

        {!user && (
          <div className="mb-4">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => showAlert("Login Failed", "danger")}
            />
          </div>
        )}

        {user && (
          <button className="btn btn-primary mb-3" onClick={fetchData} disabled={loading}>
            {loading ? 'Fetching...' : 'Fetch Headlines'}
          </button>
        )}

        <ul className="list-group mt-3">
          {headlines.map((h, i) => (
            <li key={i} className="list-group-item">
              <a href={h.url} target="_blank" rel="noreferrer">{h.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;