import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Dashboard.css";
import MatchCard from "../components/MatchCard";
import { Bell, Sparkles } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [matches, setMatches] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // 🔹 Fetch chats
  const fetchChats = async () => {
    try {
      const res = await API.get("/chat/list");
      setChats(res.data.chats || []);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Fetch matches
  const fetchMatches = async () => {
    try {
      const res = await API.get("/users/matches");
      const data = res.data.matches || [];
      setMatches(data);
      return data;
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  // 🔹 Fetch request status (optimized 🚀)
  const fetchStatus = async (users) => {
    try {
      const promises = users.map((user) =>
        API.get(`/requests/status/${user._id}`),
      );

      const responses = await Promise.all(promises);

      const map = {};
      users.forEach((user, index) => {
        map[user._id] = responses[index].data.status || "none";
      });

      setStatusMap(map);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // 🔹 Handle connect
  const handleConnect = async (userId) => {
    try {
      const res = await API.post("/requests/send", {
        receiverId: userId,
      });

      console.log(res.data);

      setStatusMap((prev) => ({
        ...prev,
        [userId]: "sent",
      }));
    } catch (err) {
      const message = err.response?.data?.message;

      // Already request exists
      if (message === "Request already exists between users") {
        setStatusMap((prev) => ({
          ...prev,
          [userId]: "sent",
        }));

        return;
      }

      console.log(message);
    }
  };

  // 🔹 Load all data
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchChats();
        const matchesData = await fetchMatches();

        if (matchesData.length > 0) {
          await fetchStatus(matchesData);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 🔹 Loading UI
  if (loading) {
    return <div className="loading-state">Loading matches...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header-modern">
        <div>
          <h1 className="dashboard-title-modern">
            Explore Matches <Sparkles className="title-sparkle" size={24} />
          </h1>
          <p className="dashboard-subtitle-modern">Find other developers to swap skills and build projects with</p>
        </div>

        <div className="header-action">
          <div className="notification-wrapper">
            <button
              className="notification-btn-modern"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="View notifications"
            >
              <Bell size={20} />
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="notification-count-modern">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown-modern glass-card">
                <div className="dropdown-header">
                  <h4>Notifications</h4>
                </div>
                <div className="dropdown-list">
                  {notifications.length === 0 ? (
                    <p className="no-notifications">No new notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className={`notification-item-modern ${n.read ? "" : "unread"}`}
                      >
                        <p>{n.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Matches Section */}
      {matches.length === 0 ? (
        <div className="no-matches-state glass-card">
          <Sparkles size={48} className="no-matches-icon" />
          <h3>No matches found yet</h3>
          <p>Try updating your profile details to match with other skill swappers.</p>
          <button className="premium-btn premium-btn-primary" onClick={() => navigate("/profile")}>
            Update Profile
          </button>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map((user) => (
            <MatchCard
              key={user._id}
              user={user}
              status={statusMap[user._id] || "none"}
              onConnect={handleConnect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
