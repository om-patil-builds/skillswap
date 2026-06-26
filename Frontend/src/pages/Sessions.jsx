import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import { Calendar, Video, BookOpen, User, Clock, PlusCircle, ExternalLink } from "lucide-react";
import "./Sessions.css";

function Sessions() {
  const location = useLocation();

  const learnerId = location.state?.learnerId;
  const learnerName = location.state?.learnerName;

  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const createSession = async () => {
    if (!topic || !date || !time || !meetLink) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await API.post("/sessions", {
        learner: learnerId,
        topic,
        date,
        time,
        meetLink,
      });

      alert("Session Scheduled Successfully ✅");

      setTopic("");
      setDate("");
      setTime("");
      setMeetLink("");
      
      // Fetch updated sessions list
      fetchSessions();
    } catch (err) {
      console.log(err);
      alert("Failed to create session ❌");
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await API.get(`/sessions/chat/${learnerId}`);
      console.log(res.data);
      setSessions(res.data.sessions || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="sessions-page">
      <h2 className="sessions-page-header gradient-heading">
        <Calendar size={28} />
        <span>Schedule Mentoring Session</span>
      </h2>

      <div className="sessions-content-split">
        {/* Left Side: Schedule Form */}
        <div className="session-form-card glass-card">
          <h3>Create Session</h3>
          <p className="form-subtitle">Fill in the details to schedule a call with your connection</p>

          <div className="premium-input-group">
            <span className="input-group-label-small">Learner</span>
            <input 
              className="premium-input" 
              value={learnerName || ""} 
              disabled 
              placeholder="Learner username" 
            />
            <User className="premium-input-icon" size={18} />
          </div>

          <div className="premium-input-group">
            <span className="input-group-label-small">Topic</span>
            <input
              className="premium-input"
              placeholder="Enter Topic (e.g. React Hooks, DB Setup)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
            <BookOpen className="premium-input-icon" size={18} />
          </div>

          <div className="premium-input-row">
            <div className="premium-input-group">
              <span className="input-group-label-small">Date</span>
              <input
                type="date"
                className="premium-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <Calendar className="premium-input-icon" size={18} />
            </div>

            <div className="premium-input-group">
              <span className="input-group-label-small">Time</span>
              <input
                type="time"
                className="premium-input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
              <Clock className="premium-input-icon" size={18} />
            </div>
          </div>

          <div className="premium-input-group">
            <span className="input-group-label-small">Google Meet Link</span>
            <input
              className="premium-input"
              placeholder="https://meet.google.com/abc-defg-hij"
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              required
            />
            <Video className="premium-input-icon" size={18} />
          </div>

          <button className="premium-btn premium-btn-primary create-session-submit-btn" onClick={createSession}>
            <PlusCircle size={18} />
            <span>Schedule Session</span>
          </button>
        </div>

        {/* Right Side: Scheduled List */}
        <div className="sessions-list-panel">
          <h3>Scheduled Meetings</h3>
          <p className="list-subtitle">Your calendar of upcoming lessons and mentoring sessions</p>

          {loading ? (
            <div className="loading-state">Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="no-sessions-placeholder glass-card">
              <Calendar size={36} className="placeholder-icon" />
              <p>No sessions scheduled yet</p>
              <span>Choose a topic and time on the left to set up a meeting.</span>
            </div>
          ) : (
            <div className="sessions-vertical-list">
              {sessions.map((session) => (
                <div className="session-card-modern glass-card" key={session._id}>
                  <div className="session-card-header">
                    <span className="session-topic-tag">📘 {session.topic}</span>
                  </div>

                  <div className="session-card-body">
                    <div className="session-participants">
                      <div className="participant-badge">
                        <span className="role-tag teacher-tag">Teacher</span>
                        <span>{session.teacher?.username}</span>
                      </div>
                      <div className="participant-badge">
                        <span className="role-tag learner-tag">Learner</span>
                        <span>{session.learner?.username}</span>
                      </div>
                    </div>

                    <div className="session-time-details">
                      <div className="detail-item">
                        <Calendar size={14} />
                        <span>{session.date}</span>
                      </div>
                      <div className="detail-item">
                        <Clock size={14} />
                        <span>{session.time}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={session.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="premium-btn premium-btn-primary join-meeting-action-btn"
                  >
                    <Video size={16} />
                    <span>Join Meeting</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sessions;
