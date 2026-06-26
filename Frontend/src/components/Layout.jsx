import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, User, Bell, Users, Calendar, LogOut, Menu, X } from "lucide-react";
import API from "../services/api";
import "./Layout.css";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentUserName = localStorage.getItem("userName") || "User";

  const navItems = [
    { name: "Explore Matches", path: "/dashboard", icon: Home },
    { name: "Requests", path: "/requests", icon: Bell },
    { name: "Connections", path: "/connections", icon: Users },
    { name: "Sessions", path: "/sessions", icon: Calendar },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.log("Logout failed", err);
      // Fallback
      localStorage.clear();
      navigate("/");
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="app-shell">
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <div className="logo" onClick={() => navigate("/dashboard")}>
          <span>SkillSwap</span> ⚡
        </div>
        <button 
          className="menu-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Desktop Sidebar Navigation */}
      <aside className="sidebar-nav">
        <div className="sidebar-brand" onClick={() => navigate("/dashboard")}>
          <span className="brand-text gradient-heading">SkillSwap</span>
          <span className="brand-bolt">⚡</span>
        </div>

        <nav className="nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                className={`nav-link-btn ${isActive ? "active" : ""}`}
                onClick={() => {
                  navigate(item.path);
                  closeMobileMenu();
                }}
              >
                <Icon size={20} className="nav-icon" />
                <span className="nav-label">{item.name}</span>
                {isActive && <span className="active-dot" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-badge">
            <div className="avatar-placeholder">
              {currentUserName.charAt(0).toUpperCase()}
            </div>
            <div className="user-info-text">
              <p className="username-label">{currentUserName}</p>
              <span className="status-badge">Online</span>
            </div>
          </div>
          <button className="logout-action-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={closeMobileMenu}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <span className="drawer-brand gradient-heading">SkillSwap ⚡</span>
              <button className="drawer-close" onClick={closeMobileMenu}>
                <X size={24} />
              </button>
            </div>

            <nav className="drawer-menu">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    className={`nav-link-btn ${isActive ? "active" : ""}`}
                    onClick={() => {
                      navigate(item.path);
                      closeMobileMenu();
                    }}
                  >
                    <Icon size={20} className="nav-icon" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            <div className="drawer-footer">
              <div className="user-profile-badge">
                <div className="avatar-placeholder">
                  {currentUserName.charAt(0).toUpperCase()}
                </div>
                <div className="user-info-text">
                  <p className="username-label">{currentUserName}</p>
                </div>
              </div>
              <button className="logout-action-btn" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="main-viewport">
        <div className="content-container">{children}</div>
      </main>
    </div>
  );
}

export default Layout;
