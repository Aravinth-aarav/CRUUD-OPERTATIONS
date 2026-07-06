import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Menu, 
  X 
} from "lucide-react";

function DashboardLayout({ 
  children, 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme, 
  isOffline 
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users Directory", icon: Users },
    { id: "health", label: "System Health", icon: Activity },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <LayoutDashboard size={24} />
          <span>CoreAdmin</span>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div
                key={item.id}
                className={`sidebar-item ${isActive ? "active" : ""}`}
                onClick={() => handleNavClick(item.id)}
              >
                <IconComponent size={20} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div 
            className="sidebar-item" 
            onClick={() => handleNavClick("settings")}
            style={{ marginTop: "auto" }}
          >
            <SettingsIcon size={20} />
            <span>Settings</span>
          </div>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="main-wrapper">
        <header className="top-header">
          <div className="header-title-section">
            <button 
              className="menu-toggle-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle Menu"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: 0 }}>
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "users" && "User Directory"}
              {activeTab === "health" && "System Health & Analytics"}
              {activeTab === "settings" && "Console Settings"}
            </h2>
          </div>

          <div className="header-actions">
            {/* Status indicator */}
            <div className={`status-indicator ${isOffline ? "offline" : "online"}`}>
              <span className={`status-dot ${!isOffline ? "ping" : ""}`}></span>
              <span>{isOffline ? "Database Offline" : "API Live"}</span>
            </div>

            {/* Theme toggle */}
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </header>

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
