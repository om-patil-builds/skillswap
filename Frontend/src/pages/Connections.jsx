import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Connections.css";

function Connections() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchConnections = async () => {
    try {
      const res = await API.get("/requests/accepted");
      setUsers(res.data.users || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="connections-container">
      <h2>Your Connections 🤝</h2>

      {users.length === 0 ? (
        <p className="empty">No connections yet</p>
      ) : (
        users.map((user) => (
          <div key={user._id} className="connection-card">

            <div className="info">
              <h3>{user.username}</h3>
              <p>{user.email}</p>
              <p><b>Skills:</b> {user.skillsHave?.join(", ")}</p>
            </div>

            <button
              className="chat-btn"
              onClick={() => navigate(`/chat/${user._id}`)}
            >
              Chat 💬
            </button>

          </div>
        ))
      )}
    </div>
  );
}

export default Connections;