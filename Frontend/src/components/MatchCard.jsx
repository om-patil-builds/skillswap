import { useNavigate } from "react-router-dom";
import { UserPlus, Clock, Check, MessageSquare, BookOpen, GraduationCap } from "lucide-react";
import "./MatchCard.css";

function MatchCard({ user, status, onConnect }) {
  const navigate = useNavigate();

  const renderButton = () => {
    if (!status || status === "none") {
      return (
        <button className="match-card-btn connect-btn" onClick={() => onConnect(user._id)}>
          <UserPlus size={16} />
          <span>Connect</span>
        </button>
      );
    }

    if (status === "sent") {
      return (
        <button className="match-card-btn pending-btn" disabled>
          <Clock size={16} />
          <span>Pending</span>
        </button>
      );
    }

    if (status === "received") {
      return (
        <button className="match-card-btn accept-btn" onClick={() => navigate("/requests")}>
          <Check size={16} />
          <span>Accept</span>
        </button>
      );
    }

    if (status === "accepted") {
      return (
        <button
          className="match-card-btn chat-btn"
          onClick={() => navigate(`/chat/${user._id}`)}
        >
          <MessageSquare size={16} />
          <span>Chat</span>
        </button>
      );
    }
  };

  return (
    <div className="match-card glass-card">
      <span className="match-badge">🔥 Match</span>

      <div className="match-card-avatar">
        {user.username.charAt(0).toUpperCase()}
      </div>

      <h3 className="match-card-username">{user.username}</h3>
      <p className="match-card-bio">{user.bio || "No bio provided yet."}</p>

      <div className="skills-section">
        <div className="skills-group">
          <span className="skills-group-title">
            <BookOpen size={14} className="skills-group-icon have-icon" />
            <strong>Teaches:</strong>
          </span>
          <div className="skills-list">
            {user.skillsHave && user.skillsHave.length > 0 ? (
              user.skillsHave.map((s, i) => (
                <span key={i} className="skill have">
                  {s}
                </span>
              ))
            ) : (
              <span className="no-skills-placeholder">None listed</span>
            )}
          </div>
        </div>

        <div className="skills-group">
          <span className="skills-group-title">
            <GraduationCap size={14} className="skills-group-icon want-icon" />
            <strong>Wants to Learn:</strong>
          </span>
          <div className="skills-list">
            {user.skillsWant && user.skillsWant.length > 0 ? (
              user.skillsWant.map((s, i) => (
                <span key={i} className="skill want">
                  {s}
                </span>
              ))
            ) : (
              <span className="no-skills-placeholder">None listed</span>
            )}
          </div>
        </div>
      </div>

      <div className="match-card-action">
        {renderButton()}
      </div>
    </div>
  );
}

export default MatchCard;