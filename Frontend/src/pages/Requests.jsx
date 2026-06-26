import { useEffect, useState } from "react";
import API from "../services/api";
import { Check, X, Bell, Mail, BookOpen } from "lucide-react";
import "./Requests.css";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/requests/my");
      setRequests(res.data.requests || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await API.put(`/requests/${id}`, { status });

      // 🔥 remove from UI instantly
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.log(err);
      alert("Failed to update request status. Please try again.");
    }
  };

  return (
    <div className="requests-page">
      <h2 className="requests-page-header gradient-heading">
        <Bell size={28} />
        <span>Pending Requests</span>
      </h2>

      {loading ? (
        <div className="loading-state">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="empty-requests-state glass-card">
          <Bell size={48} className="empty-icon" />
          <h3>All caught up!</h3>
          <p>You have no pending connection requests at the moment.</p>
        </div>
      ) : (
        <div className="requests-grid-modern">
          {requests.map((req) => (
            <div key={req._id} className="request-card-modern glass-card">
              <div className="request-card-top">
                <div className="request-avatar-circle">
                  {req.sender.username.charAt(0).toUpperCase()}
                </div>
                <div className="request-details">
                  <h3>{req.sender.username}</h3>
                  <div className="request-email">
                    <Mail size={14} />
                    <span>{req.sender.email}</span>
                  </div>
                </div>
              </div>

              <div className="request-skills-section">
                <div className="skills-title-small">
                  <BookOpen size={14} />
                  <span>Teaches:</span>
                </div>
                <div className="skills-list-small">
                  {req.sender.skillsHave && req.sender.skillsHave.length > 0 ? (
                    req.sender.skillsHave.map((skill, i) => (
                      <span key={i} className="skill-chip-small">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="no-skills-small">None listed</span>
                  )}
                </div>
              </div>

              <div className="request-actions-group">
                <button
                  className="premium-btn premium-btn-secondary request-reject-btn"
                  onClick={() => handleAction(req._id, "rejected")}
                >
                  <X size={16} />
                  <span>Decline</span>
                </button>
                
                <button
                  className="premium-btn premium-btn-primary request-accept-btn"
                  onClick={() => handleAction(req._id, "accepted")}
                >
                  <Check size={16} />
                  <span>Accept</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Requests;