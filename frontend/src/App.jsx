import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { 
  Users, 
  Cpu, 
  HardDrive, 
  Database,
  ArrowRight,
  Server,
  Code2,
  Moon,
  Sun
} from "lucide-react";
import DashboardLayout from "./components/DashboardLayout";
import StatsGrid from "./components/StatsGrid";
import Table from "./components/Table";
import "./styles/App.css";

function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [latency, setLatency] = useState(0);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });
  
  const hasFetched = useRef(false);

  // Sync theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    toast.info(`Switched to ${theme === "dark" ? "Light" : "Dark"} theme`);
  };

  const fetchUsers = async () => {
    setLoading(true);
    const start = performance.now();
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
      console.error("VITE_API_URL is missing");
      setIsOffline(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(apiUrl);
      const end = performance.now();
      
      setUsers(response.data);
      setLatency(Math.round(end - start));
      setIsOffline(false);

      if (!hasFetched.current) {
        toast.success("Database connection successful. Loaded accounts.");
        hasFetched.current = true;
      }
    } catch (error) {
      console.error("API Fetch Error: ", error);
      setIsOffline(true);
      if (!hasFetched.current) {
        toast.error("Database connection failed. Displaying offline console.");
        hasFetched.current = true;
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on initial mounting
  useEffect(() => {
    fetchUsers();
  }, []);

  // CRUD dynamic local state handlers
  const handleAddUser = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const handleEditUser = (updatedUser) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const handleDeleteUser = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <DashboardLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        isOffline={isOffline}
      >
        {/* VIEW: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="fade-in">
            {/* Quick Stats bar */}
            <StatsGrid totalUsers={users.length} isOffline={isOffline} latency={latency} />

            {/* Quick Description & Accents */}
            <div className="glass-card mb-4" style={{ padding: "2.5rem 2rem" }}>
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <span className="text-secondary" style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Operations Panel
                  </span>
                  <h1 style={{ fontSize: "2.2rem", fontWeight: "800", marginTop: "0.5rem", marginBottom: "1rem" }}>
                    Welcome to CoreAdmin Dashboard
                  </h1>
                  <p className="text-secondary" style={{ fontSize: "1.05rem", lineHeight: "1.6", maxWidth: "680px", marginBottom: "1.5rem" }}>
                    A premium full-stack platform engineered to manage users in MySQL database docker containers.
                    Navigate the workspace views to review system performance or execute user modifications.
                  </p>
                  <button 
                    className="btn-primary-custom" 
                    onClick={() => setActiveTab("users")}
                  >
                    <span>Open Directory</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
                <div className="col-lg-4 d-none d-lg-block text-center">
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <div style={{ 
                      width: "120px", 
                      height: "120px", 
                      borderRadius: "28px", 
                      background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                      boxShadow: "0 10px 40px var(--accent-glow)",
                      display: "flex",
                      alignItems: "center",
                      justifycontent: "center",
                      margin: "0 auto"
                    }}>
                      <Server size={54} color="#fff" style={{ margin: "auto" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="row g-4">
              <div className="col-md-6">
                <div className="glass-card h-100">
                  <h4 style={{ fontWeight: "700", marginBottom: "1rem" }}>System Architecture</h4>
                  <p className="text-secondary" style={{ fontSize: "0.92rem", marginBottom: "1.25rem" }}>
                    Running on a dockerized database stack integrated with React Vite frontend and Express server API protocols.
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <span className="id-badge" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Code2 size={12} /> React JS
                    </span>
                    <span className="id-badge" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Database size={12} /> MySQL
                    </span>
                    <span className="id-badge" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Server size={12} /> Node.js API
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="glass-card h-100">
                  <h4 style={{ fontWeight: "700", marginBottom: "1rem" }}>Database Connection</h4>
                  <p className="text-secondary" style={{ fontSize: "0.92rem", marginBottom: "1.25rem" }}>
                    The backend connects via a MySQL client connection pool. Set table properties and credentials inside the configuration environment.
                  </p>
                  <div className={`status-indicator ${isOffline ? "offline" : "online"}`} style={{ width: "fit-content" }}>
                    <span className={`status-dot ${!isOffline ? "ping" : ""}`}></span>
                    <span>{isOffline ? "Database Offline" : "Connected (Healthy)"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: USERS DIRECTORY */}
        {activeTab === "users" && (
          <div className="fade-in">
            <StatsGrid totalUsers={users.length} isOffline={isOffline} latency={latency} />
            <Table
              users={users}
              loading={loading}
              isOffline={isOffline}
              addUser={handleAddUser}
              editUser={handleEditUser}
              deleteUser={handleDeleteUser}
              onRetry={fetchUsers}
            />
          </div>
        )}

        {/* VIEW: SYSTEM HEALTH */}
        {activeTab === "health" && (
          <div className="fade-in">
            <div className="glass-card mb-4">
              <h4 style={{ fontWeight: "700", marginBottom: "1.5rem" }}>Live Network Diagnostics</h4>
              <div className="system-grid">
                <div>
                  <div className="system-row">
                    <span className="system-label">Backend End-Point</span>
                    <span className="system-value" style={{ color: "var(--accent-primary)" }}>
                      {import.meta.env.VITE_API_URL || "Unset"}
                    </span>
                  </div>
                  <div className="system-row">
                    <span className="system-label">Server Ping latency</span>
                    <span className="system-value">{isOffline ? "Unreachable" : `${latency} ms`}</span>
                  </div>
                  <div className="system-row">
                    <span className="system-label">MySQL Connection Status</span>
                    <span className="system-value" style={{ color: isOffline ? "var(--danger)" : "var(--success)" }}>
                      {isOffline ? "Disconnected" : "Connected"}
                    </span>
                  </div>
                  <div className="system-row">
                    <span className="system-label">Vite Dev Server Port</span>
                    <span className="system-value">:{import.meta.env.VITE_PORT || "5173"}</span>
                  </div>
                </div>

                <div>
                  <div className="system-row">
                    <span className="system-label">Simulated CPU Load</span>
                    <span className="system-value">{isOffline ? "0%" : "3.4%"}</span>
                  </div>
                  <div className="system-row">
                    <span className="system-label">Memory utilization</span>
                    <span className="system-value">{isOffline ? "0 MB" : "42.8 MB / 512 MB"}</span>
                  </div>
                  <div className="system-row">
                    <span className="system-label">Database Pool Limit</span>
                    <span className="system-value">10 connections</span>
                  </div>
                  <div className="system-row">
                    <span className="system-label">Data persistence</span>
                    <span className="system-value">Docker Volumized</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Indicators (Visual meters) */}
            <div className="glass-card">
              <h4 style={{ fontWeight: "700", marginBottom: "1.5rem" }}>Hardware Resource Load</h4>
              <div style={{ marginBottom: "1.5rem" }}>
                <div className="d-flex justify-content-between mb-2" style={{ fontSize: "0.9rem" }}>
                  <span className="system-label d-flex align-items-center gap-2"><Cpu size={16} /> API CPU Cluster</span>
                  <span className="system-value">{isOffline ? "0%" : "8%"}</span>
                </div>
                <div style={{ width: "100%", height: "8px", backgroundColor: "var(--bg-tertiary)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: isOffline ? "0%" : "8%", height: "100%", background: "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))", borderRadius: "4px" }}></div>
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between mb-2" style={{ fontSize: "0.9rem" }}>
                  <span className="system-label d-flex align-items-center gap-2"><HardDrive size={16} /> MySQL Database Disk storage</span>
                  <span className="system-value">{isOffline ? "0%" : "12.4%"}</span>
                </div>
                <div style={{ width: "100%", height: "8px", backgroundColor: "var(--bg-tertiary)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: isOffline ? "0%" : "12.4%", height: "100%", background: "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))", borderRadius: "4px" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: SETTINGS */}
        {activeTab === "settings" && (
          <div className="fade-in">
            <div className="row g-4">
              <div className="col-md-6">
                <div className="glass-card h-100">
                  <h4 style={{ fontWeight: "700", marginBottom: "1.25rem" }}>Theme customization</h4>
                  <p className="text-secondary" style={{ fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                    Select your preferred visual skin. Changing the theme will toggle the dashboard interface values.
                  </p>
                  <div className="d-flex gap-2">
                    <button 
                      className={`btn btn-sm ${theme === "dark" ? "btn-primary" : "btn-outline-secondary"}`}
                      onClick={() => setTheme("dark")}
                      style={{ borderRadius: "8px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      <Moon size={14} /> Dark Mode
                    </button>
                    <button 
                      className={`btn btn-sm ${theme === "light" ? "btn-primary" : "btn-outline-secondary"}`}
                      onClick={() => setTheme("light")}
                      style={{ borderRadius: "8px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      <Sun size={14} /> Light Mode
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="glass-card h-100">
                  <h4 style={{ fontWeight: "700", marginBottom: "1.25rem" }}>System Credentials</h4>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div style={{ 
                      width: "48px", 
                      height: "48px", 
                      borderRadius: "50%", 
                      background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                      color: "#fff",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      A
                    </div>
                    <div>
                      <h6 style={{ marginBottom: "2px", fontWeight: "700" }}>Administrator Console</h6>
                      <span className="text-secondary" style={{ fontSize: "0.8rem" }}>Active Session: root@localhost</span>
                    </div>
                  </div>
                  <table className="table table-sm table-borderless" style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                    <tbody>
                      <tr>
                        <td style={{ color: "var(--text-secondary)", padding: "2px 0" }}>System Version:</td>
                        <td style={{ fontWeight: "600", padding: "2px 0" }}>v1.2.0-stable</td>
                      </tr>
                      <tr>
                        <td style={{ color: "var(--text-secondary)", padding: "2px 0" }}>Framework:</td>
                        <td style={{ fontWeight: "600", padding: "2px 0" }}>React + Express</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}

export default App;
