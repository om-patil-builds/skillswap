import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { MessageSquare, Users, Mail, BookOpen } from "lucide-react";
import "./Connections.css";

function Connections() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchConnections = async () => {
    try {
      const res = await API.get("/requests/accepted");
      setUsers(res.data.users || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="connections-page">
      <h2 className="connections-page-header gradient-heading">
        <Users size={28} />
        <span>Your Connections</span>
      </h2>

      {loading ? (
        <div className="loading-state">Loading connections...</div>
      ) : users.length === 0 ? (
        <div className="empty-connections-state glass-card">
          <Users size={48} className="empty-icon" />
          <h3>No connections yet</h3>
          <p>Go to your dashboard to connect with other developers and build your network.</p>
          <button className="premium-btn premium-btn-primary" onClick={() => navigate("/dashboard")}>
            Explore Matches
          </button>
        </div>
      ) : (
        <div className="connections-grid-modern">
          {users.map((user) => (
            <div key={user._id} className="connection-card-modern glass-card">
              <div className="connection-card-top">
                <div className="connection-avatar-circle">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="connection-details">
                  <h3>{user.username}</h3>
                  <div className="connection-email">
                    <Mail size={14} />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="connection-skills-section">
                <div className="skills-title-small">
                  <BookOpen size={14} />
                  <span>Teaches:</span>
                </div>
                <div className="skills-list-small">
                  {user.skillsHave && user.skillsHave.length > 0 ? (
                    user.skillsHave.map((skill, i) => (
                      <span key={i} className="skill-chip-small">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="no-skills-small">None listed</span>
                  )}
                </div>
              </div>

              <button
                className="premium-btn premium-btn-primary connection-chat-btn"
                onClick={() => navigate(`/chat/${user._id}`)}
              >
                <MessageSquare size={16} />
                <span>Chat</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Connections;